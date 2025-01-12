// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YieldToken is ERC20, Ownable {
    address public minter;

    constructor(address initialOwner) 
        ERC20("Pangolin Yield Token", "PYT") 
        Ownable(initialOwner) 
    {
        minter = initialOwner;
    }

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == minter, "Only minter can mint");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(msg.sender == minter, "Only minter can burn");
        _burn(from, amount);
    }
}