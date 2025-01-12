// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@pangolindex/exchange-contracts/contracts/pangolin-core/interfaces/IPangolinPair.sol";
import "@pangolindex/exchange-contracts/contracts/pangolin-periphery/interfaces/IPangolinRouter.sol";
import "@pangolindex/governance/contracts/interfaces/IMiniChef.sol";
import "./YieldPangolin.sol";

contract PangolinDepositContract is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    YieldToken public immutable yieldToken;
    
    IERC20 public constant WAVAX = IERC20(0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7);
    IERC20 public constant PNG = IERC20(0x60781C2586D68229fde47564546784ab3fACA982);
    IPangolinRouter public constant ROUTER = IPangolinRouter(0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106);
    IMiniChef public constant MINI_CHEF = IMiniChef(0x1f806f7C8dED893fd3caE279191ad7Aa3798E928);
    
    uint256 public immutable poolId;
    IPangolinPair public immutable lpToken;
    
    struct UserInfo {
        uint256 depositAmount;
        uint256 yieldTokens;
        uint256 lastDepositTime;
        uint256 stakedLPTokens;
    }

    mapping(address => UserInfo) public userInfo;
    uint256 public totalDeposits;
    uint256 public constant PERFORMANCE_FEE = 500; // 5% fee
    uint256 public constant MIN_DEPOSIT = 0.1 ether;
    
    event Deposited(address indexed user, uint256 amount, uint256 lpTokens);
    event Withdrawn(address indexed user, uint256 amount, uint256 lpTokens);
    event RewardsHarvested(address indexed user, uint256 amount);

    constructor(
        uint256 _poolId,
        address initialOwner
    ) Ownable(initialOwner) {
        poolId = _poolId;
        
        // Get LP token from MiniChef
        (address _lpToken,,,) = MINI_CHEF.poolInfo(_poolId);
        require(_lpToken != address(0), "Invalid pool ID");
        lpToken = IPangolinPair(_lpToken);
        
        // Deploy YieldToken
        yieldToken = new YieldToken(address(this));
        
        // Approve tokens
        WAVAX.approve(address(ROUTER), type(uint256).max);
        PNG.approve(address(ROUTER), type(uint256).max);
        IERC20(_lpToken).approve(address(MINI_CHEF), type(uint256).max);
    }

    receive() external payable {
        if(msg.value > 0) {
            IWAVAX(address(WAVAX)).deposit{value: msg.value}();
        }
    }

    function deposit() external payable nonReentrant {
        require(msg.value >= MIN_DEPOSIT, "Deposit amount too low");
        
        // Convert AVAX to WAVAX
        IWAVAX(address(WAVAX)).deposit{value: msg.value}();
        
        // Split deposit amount for liquidity provision
        uint256 halfAmount = msg.value / 2;
        
        // Swap half for PNG
        address[] memory path = new address[](2);
        path[0] = address(WAVAX);
        path[1] = address(PNG);
        
        ROUTER.swapExactTokensForTokens(
            halfAmount,
            0, // Accept any amount of PNG
            path,
            address(this),
            block.timestamp
        );
        
        // Add liquidity
        uint256 wavaxBalance = WAVAX.balanceOf(address(this));
        uint256 pngBalance = PNG.balanceOf(address(this));
        
        (address token0, address token1) = address(WAVAX) < address(PNG) 
            ? (address(WAVAX), address(PNG)) 
            : (address(PNG), address(WAVAX));
        
        (,,uint256 lpReceived) = ROUTER.addLiquidity(
            token0,
            token1,
            token0 == address(WAVAX) ? wavaxBalance : pngBalance,
            token0 == address(WAVAX) ? pngBalance : wavaxBalance,
            0, // Accept any amount
            0, // Accept any amount
            address(this),
            block.timestamp
        );
        
        require(lpReceived > 0, "No LP tokens received");
        
        // Stake LP tokens in MiniChef
        MINI_CHEF.deposit(poolId, lpReceived, address(this));
        
        // Mint yield tokens
        uint256 yieldTokenAmount = calculateYieldTokens(msg.value);
        yieldToken.mint(msg.sender, yieldTokenAmount);
        
        // Update user info
        UserInfo storage user = userInfo[msg.sender];
        user.depositAmount += msg.value;
        user.yieldTokens += yieldTokenAmount;
        user.lastDepositTime = block.timestamp;
        user.stakedLPTokens += lpReceived;
        
        totalDeposits += msg.value;
        
        emit Deposited(msg.sender, msg.value, lpReceived);
    }

    function withdraw(uint256 yieldTokenAmount) external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        require(yieldTokenAmount > 0, "Amount must be greater than 0");
        require(user.yieldTokens >= yieldTokenAmount, "Insufficient yield tokens");

        // Calculate proportional LP tokens to withdraw
        uint256 lpAmount = (user.stakedLPTokens * yieldTokenAmount) / user.yieldTokens;
        require(lpAmount > 0, "No LP tokens to withdraw");
        
        // Withdraw from MiniChef
        MINI_CHEF.withdraw(poolId, lpAmount, address(this));
        
        // Remove liquidity
        lpToken.approve(address(ROUTER), lpAmount);
        
        (address token0, address token1) = address(WAVAX) < address(PNG) 
            ? (address(WAVAX), address(PNG)) 
            : (address(PNG), address(WAVAX));
        
        (uint256 amount0, uint256 amount1) = ROUTER.removeLiquidity(
            token0,
            token1,
            lpAmount,
            0, // Accept any amount
            0, // Accept any amount
            address(this),
            block.timestamp
        );
        
        // Swap all PNG to WAVAX
        if (PNG.balanceOf(address(this)) > 0) {
            address[] memory path = new address[](2);
            path[0] = address(PNG);
            path[1] = address(WAVAX);
            
            ROUTER.swapExactTokensForTokens(
                PNG.balanceOf(address(this)),
                0, // Accept any amount
                path,
                address(this),
                block.timestamp
            );
        }
        
        // Calculate total WAVAX amount
        uint256 totalWavaxAmount = WAVAX.balanceOf(address(this));
        
        // Calculate and deduct fees
        uint256 performanceFee = (totalWavaxAmount * PERFORMANCE_FEE) / 10000;
        uint256 withdrawAmount = totalWavaxAmount - performanceFee;
        
        // Update user info
        yieldToken.burn(msg.sender, yieldTokenAmount);
        user.yieldTokens -= yieldTokenAmount;
        user.depositAmount = (user.depositAmount * (user.yieldTokens)) / (user.yieldTokens + yieldTokenAmount);
        user.stakedLPTokens -= lpAmount;
        totalDeposits -= withdrawAmount;
        
        // Transfer WAVAX
        WAVAX.safeTransfer(owner(), performanceFee);
        
        // Unwrap WAVAX to AVAX and send to user
        IWAVAX(address(WAVAX)).withdraw(withdrawAmount);
        payable(msg.sender).transfer(withdrawAmount);
        
        emit Withdrawn(msg.sender, withdrawAmount, lpAmount);
    }

    function harvestRewards() external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        require(user.stakedLPTokens > 0, "No LP tokens staked");
        
        uint256 beforeBalance = PNG.balanceOf(address(this));
        MINI_CHEF.harvest(poolId, address(this));
        uint256 harvestedAmount = PNG.balanceOf(address(this)) - beforeBalance;
        
        if(harvestedAmount > 0) {
            // Take performance fee
            uint256 fee = (harvestedAmount * PERFORMANCE_FEE) / 10000;
            PNG.safeTransfer(owner(), fee);
            
            // Send remaining rewards to user
            uint256 userRewards = harvestedAmount - fee;
            PNG.safeTransfer(msg.sender, userRewards);
            
            emit RewardsHarvested(msg.sender, userRewards);
        }
    }

    function calculateYieldTokens(uint256 amount) public view returns (uint256) {
        if (totalDeposits == 0 || yieldToken.totalSupply() == 0) {
            return amount;
        }
        return (amount * yieldToken.totalSupply()) / totalDeposits;
    }

    function getPendingRewards(address user) external view returns (uint256) {
        return MINI_CHEF.pendingPNG(poolId, address(this));
    }

    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        // Withdraw all LP tokens from MiniChef
        (uint256 stakedAmount,,,) = MINI_CHEF.userInfo(poolId, address(this));
        if(stakedAmount > 0) {
            MINI_CHEF.emergencyWithdraw(poolId, address(this));
        }
        
        // Transfer any tokens to owner
        uint256 lpBalance = lpToken.balanceOf(address(this));
        uint256 wavaxBalance = WAVAX.balanceOf(address(this));
        uint256 pngBalance = PNG.balanceOf(address(this));
        
        if(lpBalance > 0) lpToken.transfer(owner(), lpBalance);
        if(wavaxBalance > 0) WAVAX.safeTransfer(owner(), wavaxBalance);
        if(pngBalance > 0) PNG.safeTransfer(owner(), pngBalance);
    }
}