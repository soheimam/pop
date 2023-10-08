pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract UserProfileNFT is ERC721 {
    uint256 private _tokenIdCounter;

    constructor() ERC721("DHuffer", "DHUFF") {}

    function mintNFT(address to) public {
        _mint(to, _tokenIdCounter);
        _tokenIdCounter++;
    }
}