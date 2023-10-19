// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract RoadWorthyRecord is ERC721 {
    uint256 private _currentTokenId = 0; // to keep track of the last minted token
    string private _baseTokenURI = "https://api.metafuse.me/assets/e56510e1-48c8-432e-9295-883b1531a0bc/";


    event RoadWorthyRecordMinted(address indexed to, uint256 indexed tokenId);


    constructor() ERC721("Proof of Road worthy", "POR") {} 

    function setBaseURI(string memory baseURI) external {
        _baseTokenURI = baseURI;
    }

    function getBaseURI() external view returns (string memory) {
        return _baseTokenURI;
    }

    function getTokenURI(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        string memory baseURI = _baseTokenURI;
        return bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI, Strings.toString(tokenId), ".json"))
            : "";
    }


    function mintRoadWorthyRecord(address to, address tba) public payable returns (uint256) {
        uint256 newTokenId = _getNextTokenId(); // get the next tokenId
        _mint(to, newTokenId); // mint the token
        _transfer(to, tba, newTokenId); // transfer the token to the TBA
        emit RoadWorthyRecordMinted(to, newTokenId); // emit the event

        return newTokenId; // return the new tokenId
    }

    function _getNextTokenId() private returns (uint256) {
        _currentTokenId++; // increment the current token id
        return _currentTokenId; // return the new tokenId
    }
}
