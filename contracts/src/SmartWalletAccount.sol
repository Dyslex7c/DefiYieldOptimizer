// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @dev User Operation struct that defines the details of a transaction
 */
struct UserOperation {
    address sender;
    uint256 nonce;
    bytes initCode;
    bytes callData;
    uint256 callGasLimit;
    uint256 verificationGasLimit;
    uint256 preVerificationGas;
    uint256 maxFeePerGas;
    uint256 maxPriorityFeePerGas;
    bytes paymasterAndData;
    bytes signature;
}

/**
 * @dev Interface for the Entry Point contract
 */
interface IEntryPoint {
    function handleOps(UserOperation[] calldata ops, address payable beneficiary) external;
}

/**
 * @dev Base Account interface
 */
interface IAccount {
    function validateUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256 missingAccountFunds)
        external returns (uint256 validationData);
}

/**
 * @title SmartWalletAccount
 * @dev ERC-4337 compatible smart wallet with partial permission delegation for pAVAX/yAVAX management
 */
contract SmartWalletAccount is IAccount, Ownable, EIP712 {
    using ECDSA for bytes32;

    IEntryPoint private immutable _entryPoint;
    
    // Constants for validation
    uint256 constant SIG_VALIDATION_FAILED = 1;
    
    // EIP712 type hash constants
    bytes32 private constant USER_OP_TYPEHASH = keccak256(
        "UserOperation(address sender,uint256 nonce,bytes initCode,bytes callData,uint256 callGasLimit,uint256 verificationGasLimit,uint256 preVerificationGas,uint256 maxFeePerGas,uint256 maxPriorityFeePerGas,bytes paymasterAndData)"
    );
    
    // Permission settings
    struct Permission {
        uint256 maxAmount;
        uint256 expiryTime;
        bool canMint;
        bool canBurn;
        bool isActive;
    }
    
    // Mapping of token address => delegated address => Permission
    mapping(address => mapping(address => Permission)) public permissions;
    
    // Events
    error InvalidSignature();
    event PermissionGranted(address token, address delegate, uint256 maxAmount, uint256 expiryTime, bool canMint, bool canBurn);
    event PermissionRevoked(address token, address delegate);
    event TransactionExecuted(address target, uint256 value, bytes data);

    constructor(
        IEntryPoint entryPoint_,
        address owner_
    ) Ownable(owner_) EIP712("SmartWalletAccount", "1") {
        _entryPoint = entryPoint_;
    }

    function _requireFromEntryPoint() internal view {
        require(msg.sender == address(_entryPoint), "Sender not EntryPoint");
    }

    function _hashUserOp(UserOperation calldata userOp) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            USER_OP_TYPEHASH,
            userOp.sender,
            userOp.nonce,
            keccak256(userOp.initCode),
            keccak256(userOp.callData),
            userOp.callGasLimit,
            userOp.verificationGasLimit,
            userOp.preVerificationGas,
            userOp.maxFeePerGas,
            userOp.maxPriorityFeePerGas,
            keccak256(userOp.paymasterAndData)
        ));
    }

    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 missingAccountFunds
    ) external override returns (uint256 validationData) {
        _requireFromEntryPoint();

        // Create EIP712 digest
        bytes32 digest = _hashTypedDataV4(_hashUserOp(userOp));
        
        // Split signature
        (bytes32 r, bytes32 s, uint8 v) = _splitSignature(userOp.signature);
        
        // Verify signature
        if (!_isValidSignature(owner(), digest, v, r, s)) {
            return SIG_VALIDATION_FAILED;
        }

        if (missingAccountFunds > 0) {
            (bool success,) = payable(msg.sender).call{value: missingAccountFunds}("");
            require(success, "Failed to pay prefund");
        }

        return 0;
    }

    function _splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

    function _isValidSignature(
        address account,
        bytes32 digest,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal pure returns (bool) {
        (address recoveredSigner, ECDSA.RecoverError error, ) = ECDSA.tryRecover(digest, v, r, s);
        if (error != ECDSA.RecoverError.NoError) {
            return false;
        }
        return (recoveredSigner == account);
    }

    function grantPermission(
        address token,
        address delegate,
        uint256 maxAmount,
        uint256 duration,
        bool canMint,
        bool canBurn
    ) external onlyOwner {
        require(delegate != address(0), "Invalid delegate address");
        require(maxAmount > 0, "Invalid amount");
        
        permissions[token][delegate] = Permission({
            maxAmount: maxAmount,
            expiryTime: block.timestamp + duration,
            canMint: canMint,
            canBurn: canBurn,
            isActive: true
        });
        
        emit PermissionGranted(token, delegate, maxAmount, block.timestamp + duration, canMint, canBurn);
    }

    function revokePermission(address token, address delegate) external onlyOwner {
        require(permissions[token][delegate].isActive, "Permission not active");
        delete permissions[token][delegate];
        emit PermissionRevoked(token, delegate);
    }

    function validatePermission(
        address token,
        address delegate,
        uint256 amount,
        bool isMinting
    ) internal view returns (bool) {
        Permission memory perm = permissions[token][delegate];
        
        return perm.isActive &&
               block.timestamp < perm.expiryTime &&
               amount <= perm.maxAmount &&
               ((isMinting && perm.canMint) || (!isMinting && perm.canBurn));
    }

    function executeTransaction(
        address target,
        uint256 value,
        bytes calldata data
    ) external returns (bool) {
        require(msg.sender == owner() || 
                validatePermission(target, msg.sender, value, true) ||
                validatePermission(target, msg.sender, value, false),
                "Unauthorized");
        
        (bool success,) = target.call{value: value}(data);
        require(success, "Transaction failed");
        
        emit TransactionExecuted(target, value, data);
        return success;
    }

    function entryPoint() public view returns (IEntryPoint) {
        return _entryPoint;
    }

    receive() external payable {}
}