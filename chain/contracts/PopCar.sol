// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract PopCar is ERC721 {
    uint256 private _currentTokenId = 0; // to keep track of the last minted token

    event CarMinted(address indexed to, uint256 indexed tokenId);

    constructor() ERC721("Proof Of Purchase Car", "POP") {} 

    function mintCar(address to) public payable returns (uint256) {
        uint256 newTokenId = _getNextTokenId(); // get the next tokenId
        _mint(to, newTokenId); // mint the token
        emit CarMinted(to, newTokenId); // emit the event

        return newTokenId; // return the new tokenId
    }

    function _getNextTokenId() private returns (uint256) {
        _currentTokenId++; // increment the current token id
        return _currentTokenId; // return the new tokenId
    }
}
