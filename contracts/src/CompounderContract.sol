// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./DepositContract.sol";
import "./AllocationContract.sol";

contract CompounderContract is Ownable {
    using SafeERC20 for IERC20;

    DepositContract public depositContract;
    AllocationContract public allocationContract;
    
    uint256 public lastCompoundTime;
    uint256 public constant COMPOUND_INTERVAL = 24 hours;
    
    event Compounded(uint256 amount, uint256 timestamp);

    constructor(address _depositContract, address _allocationContract) {
        depositContract = DepositContract(_depositContract);
        allocationContract = AllocationContract(_allocationContract);
        lastCompoundTime = block.timestamp;
    }

    function compound() external {
        require(block.timestamp >= lastCompoundTime + COMPOUND_INTERVAL, "Too early to compound");
        
        address bestFarm = allocationContract.getBestFarm();
        uint256 rewards = harvestRewards(bestFarm);
        
        if (rewards > 0) {
            reinvestRewards(rewards);
            lastCompoundTime = block.timestamp;
            emit Compounded(rewards, block.timestamp);
        }
    }

    function harvestRewards(address farm) internal returns (uint256) {
        // Implementation would depend on specific farm interface
        return 0;
    }

    function reinvestRewards(uint256 amount) internal {
        // Implementation would depend on specific farm interface
    }
}