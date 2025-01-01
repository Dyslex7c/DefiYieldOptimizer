// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./YieldToken.sol";
import "./interfaces/ITraderJoe.sol";
import "./interfaces/IPangolin.sol";

contract DepositContract is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    YieldToken public yieldToken;
    IERC20 public constant WAVAX = IERC20(0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7); // Wrapped AVAX on Avalanche
    
    struct UserInfo {
        uint256 depositAmount;
        uint256 yieldTokens;
        uint256 lastDepositTime;
    }

    mapping(address => UserInfo) public userInfo;
    uint256 public totalDeposits;
    uint256 public constant PERFORMANCE_FEE = 500; // 5% fee (basis points)
    uint256 public constant MIN_DEPOSIT = 0.1 ether; // 0.1 AVAX minimum deposit
    
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardsHarvested(uint256 amount);

    constructor() {
        yieldToken = new YieldToken();
    }

    // Allow receiving AVAX
    receive() external payable {
        // Convert received AVAX to WAVAX for yield farming
        if(msg.value > 0) {
            // Wrap AVAX to WAVAX
            IWAVAX(address(WAVAX)).deposit{value: msg.value}();
        }
    }

    function deposit() external payable nonReentrant {
        require(msg.value >= MIN_DEPOSIT, "Deposit amount too low");
        
        // Convert AVAX to WAVAX
        IWAVAX(address(WAVAX)).deposit{value: msg.value}();
        
        uint256 yieldTokenAmount = calculateYieldTokens(msg.value);
        yieldToken.mint(msg.sender, yieldTokenAmount);
        
        userInfo[msg.sender].depositAmount += msg.value;
        userInfo[msg.sender].yieldTokens += yieldTokenAmount;
        userInfo[msg.sender].lastDepositTime = block.timestamp;
        
        totalDeposits += msg.value;
        
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        require(amount > 0, "Amount must be greater than 0");
        require(user.yieldTokens >= amount, "Insufficient yield tokens");

        uint256 avaxAmount = calculateDepositTokens(amount);
        require(avaxAmount > 0, "Invalid withdrawal amount");

        yieldToken.burn(msg.sender, amount);
        user.yieldTokens -= amount;
        user.depositAmount -= avaxAmount;
        totalDeposits -= avaxAmount;

        uint256 performanceFee = (avaxAmount * PERFORMANCE_FEE) / 10000;
        uint256 withdrawAmount = avaxAmount - performanceFee;

        // Unwrap WAVAX to AVAX and send to user
        IWAVAX(address(WAVAX)).withdraw(withdrawAmount);
        payable(msg.sender).transfer(withdrawAmount);
        
        // Send fee in WAVAX to owner
        WAVAX.safeTransfer(owner(), performanceFee);

        emit Withdrawn(msg.sender, withdrawAmount);
    }

    function calculateYieldTokens(uint256 amount) public view returns (uint256) {
        if (totalDeposits == 0 || yieldToken.totalSupply() == 0) {
            return amount;
        }
        return (amount * yieldToken.totalSupply()) / totalDeposits;
    }

    function calculateDepositTokens(uint256 amount) public view returns (uint256) {
        require(yieldToken.totalSupply() > 0, "No yield tokens in circulation");
        return (amount * totalDeposits) / yieldToken.totalSupply();
    }
}