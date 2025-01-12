// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

interface IMiniChef {
    struct UserInfo {
        uint256 amount;
        int256 rewardDebt;
        uint256 rewardDebtAtTime;
        uint256 lastWithdrawTime;
        uint256 firstDepositTime;
        uint256 timeDelta;
        uint256 lastDepositTime;
    }

    struct PoolInfo {
        uint256 accRewardPerShare;
        uint256 lastRewardTime;
        uint256 allocPoint;
        uint256 totalLpSupply;
    }

    function poolInfo(uint256 pid) external view returns (
        address lpToken,
        uint256 allocPoint,
        uint256 lastRewardTime,
        uint256 accRewardPerShare
    );

    function userInfo(uint256 _pid, address _user) external view returns (
        uint256 amount,
        int256 rewardDebt,
        uint256 rewardDebtAtTime,
        uint256 lastWithdrawTime
    );

    function deposit(uint256 pid, uint256 amount, address to) external;
    function withdraw(uint256 pid, uint256 amount, address to) external;
    function harvest(uint256 pid, address to) external;
    function emergencyWithdraw(uint256 pid, address to) external;
    function pendingPNG(uint256 _pid, address _user) external view returns (uint256 pending);
}

interface IWAVAX {
    function deposit() external payable;
    function withdraw(uint256) external;
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
}