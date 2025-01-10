// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

abstract contract BaseToken is ERC20, Ownable {
    error InvalidAmount();
    error InsufficientBalance();
    error UnauthorizedMinter();

    mapping(address => bool) public authorizedMinters;

    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {
        authorizedMinters[initialOwner] = true;
    }

    modifier onlyAuthorizedMinter() {
        if (!authorizedMinters[msg.sender]) revert UnauthorizedMinter();
        _;
    }

    function addMinter(address minter) external onlyOwner {
        require(minter != address(0), "Invalid minter address");
        authorizedMinters[minter] = true;
    }

    function removeMinter(address minter) external onlyOwner {
        require(minter != address(0), "Invalid minter address");
        authorizedMinters[minter] = false;
    }

    function mint(address to, uint256 amount) external onlyAuthorizedMinter {
        if (amount == 0) revert InvalidAmount();
        require(to != address(0), "Invalid recipient address");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyAuthorizedMinter {
        if (amount == 0) revert InvalidAmount();
        if (balanceOf(from) < amount) revert InsufficientBalance();
        _burn(from, amount);
    }

    function isMinter(address account) external view returns (bool) {
        return authorizedMinters[account];
    }
}

// Yield Token Contract
contract YieldToken is BaseToken {
    constructor(address initialOwner) 
        BaseToken("Avalanche Yield AVAX", "yAVAX", initialOwner) 
    {}
}

// Principal Token Contract
contract PrincipalToken is BaseToken {
    constructor(address initialOwner) 
        BaseToken("Avalanche Principal AVAX", "pAVAX", initialOwner) 
    {}
}

contract YieldTokenization is ReentrancyGuard {
    error InvalidTokenAddress();
    error InvalidAmount();
    error MintFailed();
    error BurnFailed();
    error NotInitialized();
    error InvalidMaturity();
    error InsufficientBalance();
    error MaturityNotReached();

    YieldToken public immutable yieldToken;
    PrincipalToken public immutable principalToken;
    address public immutable owner;
    uint256 public immutable maturityTimestamp;

    event YieldTokensMinted(address indexed to, uint256 amount);
    event YieldTokensBurned(address indexed from, uint256 amount);
    event PrincipalTokensMinted(address indexed to, uint256 amount);
    event PrincipalTokensBurned(address indexed from, uint256 amount);
    event TokensRedeemed(address indexed from, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier afterMaturity() {
        if (block.timestamp < maturityTimestamp) revert MaturityNotReached();
        _;
    }

    constructor(uint256 _maturityTimestamp) {
        if (_maturityTimestamp <= block.timestamp) revert InvalidMaturity();
        
        owner = msg.sender;
        maturityTimestamp = _maturityTimestamp;
        
        // Initialize both tokens
        yieldToken = new YieldToken(address(this));
        principalToken = new PrincipalToken(address(this));
        
        // Add this contract as minter for both tokens
        yieldToken.addMinter(address(this));
        principalToken.addMinter(address(this));
    }

    function mintYieldTokens(address to, uint256 amount) external onlyOwner nonReentrant {
        if (amount == 0) revert InvalidAmount();
        
        try yieldToken.mint(to, amount) {
            emit YieldTokensMinted(to, amount);
        } catch {
            revert MintFailed();
        }
    }

    function mintPrincipalTokens(address to, uint256 amount) external onlyOwner nonReentrant {
        if (amount == 0) revert InvalidAmount();
        
        try principalToken.mint(to, amount) {
            emit PrincipalTokensMinted(to, amount);
        } catch {
            revert MintFailed();
        }
    }

    function burnYieldTokens(address from, uint256 amount) external onlyOwner nonReentrant {
        if (amount == 0) revert InvalidAmount();
        
        try yieldToken.burn(from, amount) {
            emit YieldTokensBurned(from, amount);
        } catch {
            revert BurnFailed();
        }
    }

    function burnPrincipalTokens(address from, uint256 amount) external onlyOwner nonReentrant {
        if (amount == 0) revert InvalidAmount();
        
        try principalToken.burn(from, amount) {
            emit PrincipalTokensBurned(from, amount);
        } catch {
            revert BurnFailed();
        }
    }

    // Function to mint both yield and principal tokens in equal amounts
    function mintBothTokens(address to, uint256 amount) external onlyOwner nonReentrant {
        if (amount == 0) revert InvalidAmount();
        
        try yieldToken.mint(to, amount) {
            emit YieldTokensMinted(to, amount);
        } catch {
            revert MintFailed();
        }
        
        try principalToken.mint(to, amount) {
            emit PrincipalTokensMinted(to, amount);
        } catch {
            revert MintFailed();
        }
    }

    // Function to redeem principal tokens after maturity
    function redeemPrincipal(uint256 amount) external afterMaturity nonReentrant {
        if (amount == 0) revert InvalidAmount();
        if (principalToken.balanceOf(msg.sender) < amount) revert InsufficientBalance();
        
        try principalToken.burn(msg.sender, amount) {
            emit TokensRedeemed(msg.sender, amount);
            // Add your redemption logic here (e.g., transfer underlying assets)
        } catch {
            revert BurnFailed();
        }
    }

    function getYieldTokenAddress() external view returns (address) {
        return address(yieldToken);
    }

    function getPrincipalTokenAddress() external view returns (address) {
        return address(principalToken);
    }

    function getMaturityTimestamp() external view returns (uint256) {
        return maturityTimestamp;
    }
}