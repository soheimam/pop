// SPDX-License-Identifier: MIT 
pragma solidity 0.8.19;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./ICarStuff.sol";

contract CarNFT is ERC721, ICarNFT {

    constructor() ERC721("CAR","WOO") {
    }

    function hello() external pure returns (string memory) {
        return "hello";
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

}