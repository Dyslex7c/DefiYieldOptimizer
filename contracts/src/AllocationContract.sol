// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AllocationContract is Ownable {
    using SafeERC20 for IERC20;

    struct Farm {
        address protocol;
        uint256 allocation;
        uint256 apy;
        bool active;
    }

    mapping(address => Farm) public farms;
    address[] public activeFarms;
    
    event FarmAdded(address indexed protocol, uint256 allocation);
    event FarmUpdated(address indexed protocol, uint256 newAllocation);
    event APYUpdated(address indexed protocol, uint256 newAPY);

    function addFarm(address protocol, uint256 allocation, uint256 apy) external onlyOwner {
        require(protocol != address(0), "Invalid protocol address");
        require(!farms[protocol].active, "Farm already exists");
        require(allocation <= 10000, "Allocation exceeds 100%");

        farms[protocol] = Farm({
            protocol: protocol,
            allocation: allocation,
            apy: apy,
            active: true
        });
        
        activeFarms.push(protocol);
        emit FarmAdded(protocol, allocation);
    }

    function updateAllocation(address protocol, uint256 newAllocation) external onlyOwner {
        require(farms[protocol].active, "Farm not active");
        require(newAllocation <= 10000, "Allocation exceeds 100%");

        farms[protocol].allocation = newAllocation;
        emit FarmUpdated(protocol, newAllocation);
    }

    function updateAPY(address protocol, uint256 newAPY) external onlyOwner {
        require(farms[protocol].active, "Farm not active");
        
        farms[protocol].apy = newAPY;
        emit APYUpdated(protocol, newAPY);
    }

    function getBestFarm() external view returns (address) {
        require(activeFarms.length > 0, "No active farms");
        
        address bestFarm = activeFarms[0];
        uint256 bestAPY = farms[bestFarm].apy;
        
        for (uint i = 1; i < activeFarms.length; i++) {
            if (farms[activeFarms[i]].apy > bestAPY) {
                bestFarm = activeFarms[i];
                bestAPY = farms[activeFarms[i]].apy;
            }
        }
        
        return bestFarm;
    }
}