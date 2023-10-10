// SPDX-License-Identifier: MIT 
pragma solidity 0.8.19;

interface ICarNFT  {
    function mint(address to, uint256 tokenId) external;
    function hello() external pure returns (string memory);
}