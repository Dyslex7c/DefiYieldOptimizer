// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract YieldToken is ERC20, Ownable {
    // Add error definitions
    error InvalidAmount();
    error InsufficientBalance();
    error UnauthorizedMinter();

    mapping(address => bool) public authorizedMinters;

    constructor(address initialOwner) 
        ERC20("Avalanche Yield AVAX", "yAVAX") 
        Ownable(initialOwner) // Correct initialization of Ownable without passing the owner in constructor.
    {
        _transferOwnership(initialOwner); // Explicitly set the owner
        authorizedMinters[initialOwner] = true;
    }

    modifier onlyAuthorizedMinter() {
        if (!authorizedMinters[msg.sender]) revert UnauthorizedMinter();
        _;
    }

    function addMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }

    function removeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
    }

    function mint(address to, uint256 amount) external onlyAuthorizedMinter {
        if (amount == 0) revert InvalidAmount();
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyAuthorizedMinter {
        if (amount == 0) revert InvalidAmount();
        if (balanceOf(from) < amount) revert InsufficientBalance();
        _burn(from, amount);
    }
}

contract YieldTokenization is Ownable, ReentrancyGuard {
    YieldToken public yieldToken;
    
    // Add error definitions
    error InvalidTokenAddress();
    error InvalidAmount();
    error MintFailed();
    error BurnFailed();

    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    constructor(address _yieldTokenAddress, address initialOwner) 
        Ownable(initialOwner) // Correct initialization of Ownable without passing the owner in constructor.
    {
        if (_yieldTokenAddress == address(0)) revert InvalidTokenAddress();
        yieldToken = YieldToken(_yieldTokenAddress);
        _transferOwnership(initialOwner); // Explicitly set the owner

        // Direct mapping initialization in YieldToken constructor
    }

    function requestMint(uint256 amount) external nonReentrant {
        if (amount == 0) revert InvalidAmount();
        
        try yieldToken.mint(msg.sender, amount) {
            emit TokensMinted(msg.sender, amount);
        } catch {
            revert MintFailed();
        }
    }

    function requestBurn(uint256 amount) external nonReentrant {
        if (amount == 0) revert InvalidAmount();
        
        try yieldToken.burn(msg.sender, amount) {
            emit TokensBurned(msg.sender, amount);
        } catch {
            revert BurnFailed();
        }
    }

    function recoverMinterRole() external onlyOwner {
        yieldToken.addMinter(address(this));
    }
}
