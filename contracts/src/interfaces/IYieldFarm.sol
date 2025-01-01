// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IYieldFarm {
    function deposit(uint256 amount) external;
    function withdraw(uint256 amount) external;
    function getRewards() external returns (uint256);
    function getCurrentAPY() external view returns (uint256);
}