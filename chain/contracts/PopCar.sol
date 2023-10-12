// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract PopCar is ERC721 {
    constructor() ERC721("Proof Of Purchase Car", "POP") {} 
    function mintCar(address to, uint256 tokenId) public payable {
        _mint(to, tokenId);
    }
}