// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ITraderJoe {
    function deposit(uint256 pid, uint256 amount) external;
    function withdraw(uint256 pid, uint256 amount) external;
    function pendingJoe(uint256 pid, address user) external view returns (uint256);
    function userInfo(uint256 pid, address user) external view returns (uint256, uint256);
}