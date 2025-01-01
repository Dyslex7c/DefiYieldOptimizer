// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IPangolin.sol";

contract PangolinStrategy is Ownable {
    using SafeERC20 for IERC20;

    // Pangolin MasterChef contract
    IPangolin public constant PANGOLIN_MASTER = IPangolin(0x1f806f7C8dED893fd3caE279191ad7Aa3798E928);
    
    // Pangolin's PNG token
    IERC20 public constant PNG = IERC20(0x60781C2586D68229fde47564546784ab3fACA982);
    
    // Wrapped AVAX
    IERC20 public constant WAVAX = IERC20(0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7);
    
    // Pool ID for WAVAX-PNG farm
    uint256 public immutable poolId;
    
    // Minimum time between harvests
    uint256 public constant HARVEST_COOLDOWN = 12 hours;
    uint256 public lastHarvestTimestamp;

    event Harvested(uint256 pngAmount, uint256 wavaxAmount);
    event Deposited(uint256 amount);
    event Withdrawn(uint256 amount);

    constructor(uint256 _poolId) {
        poolId = _poolId;
        
        // Approve PNG token for trading
        PNG.approve(address(PANGOLIN_MASTER), type(uint256).max);
        // Approve WAVAX for trading
        WAVAX.approve(address(PANGOLIN_MASTER), type(uint256).max);
    }

    function deposit(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer WAVAX from caller
        WAVAX.safeTransferFrom(msg.sender, address(this), amount);
        
        // Deposit to Pangolin farm
        PANGOLIN_MASTER.deposit(poolId, amount);
        
        emit Deposited(amount);
    }

    function withdraw(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        
        // Withdraw from Pangolin farm
        PANGOLIN_MASTER.withdraw(poolId, amount);
        
        // Transfer WAVAX back to caller
        WAVAX.safeTransfer(msg.sender, amount);
        
        emit Withdrawn(amount);
    }

    function harvest() external {
        require(block.timestamp >= lastHarvestTimestamp + HARVEST_COOLDOWN, "Harvest cooldown not met");
        
        // Get pending PNG rewards
        uint256 pngBefore = PNG.balanceOf(address(this));
        
        // Harvest rewards
        PANGOLIN_MASTER.deposit(poolId, 0);
        
        uint256 pngHarvested = PNG.balanceOf(address(this)) - pngBefore;
        
        if (pngHarvested > 0) {
            // Here you would typically swap PNG for WAVAX using Pangolin
            // For simplicity, we're just transferring PNG to owner
            PNG.safeTransfer(owner(), pngHarvested);
        }
        
        lastHarvestTimestamp = block.timestamp;
        
        emit Harvested(pngHarvested, 0);
    }

    function getStakedBalance() external view returns (uint256) {
        (uint256 amount,) = PANGOLIN_MASTER.userInfo(poolId, address(this));
        return amount;
    }

    function getPendingRewards() external view returns (uint256) {
        return PANGOLIN_MASTER.pendingReward(poolId, address(this));
    }
}