// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimplePangolinDeposit is ReentrancyGuard, Ownable {
    IERC20 public immutable wavax;
    
    struct UserInfo {
        uint256 depositAmount;
        uint256 lastDepositTime;
    }
    
    mapping(address => UserInfo) public userInfo;
    uint256 public totalDeposits;
    
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    
    constructor(
        address _wavax,
        address initialOwner
    ) Ownable(initialOwner) {
        wavax = IERC20(_wavax);
    }
    
    receive() external payable {
        // Allow contract to receive AVAX
    }
    
    function deposit() external payable nonReentrant {
        require(msg.value > 0, "Zero deposit");
        
        // Update user info
        UserInfo storage user = userInfo[msg.sender];
        user.depositAmount += msg.value;
        user.lastDepositTime = block.timestamp;
        
        totalDeposits += msg.value;
        
        emit Deposited(msg.sender, msg.value);
    }
    
    function withdraw(uint256 amount) external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        require(amount > 0, "Zero amount");
        require(user.depositAmount >= amount, "Insufficient balance");
        require(address(this).balance >= amount, "Insufficient contract balance");
        
        // Update state
        user.depositAmount -= amount;
        totalDeposits -= amount;
        
        // Transfer AVAX back to user
        payable(msg.sender).transfer(amount);
        
        emit Withdrawn(msg.sender, amount);
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if(balance > 0) {
            payable(owner()).transfer(balance);
        }
    }
    
    function getUserDeposit(address user) external view returns (UserInfo memory) {
        return userInfo[user];
    }
}