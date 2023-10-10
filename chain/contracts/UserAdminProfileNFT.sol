// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract UserAdminProfileNFT is ERC721, Ownable {
    constructor() ERC721("DHuffer", "DHUFF") {}
    function mintNFT(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }
}