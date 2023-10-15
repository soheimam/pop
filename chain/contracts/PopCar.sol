// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract PopCar is ERC721 {
    uint256 private _currentTokenId = 0; // to keep track of the last minted token
    string private _baseTokenURI = "https://api.metafuse.me/assets/be82af4a-9515-4c14-979f-27685ede3bbd/";


    event CarMinted(address indexed to, uint256 indexed tokenId);

    modifier onlyAllowedAddresses() {
    require(
        msg.sender == 0x7516e89D7111fEfaa312b58A06130F5B5DcDd01D ||
        msg.sender == 0x773660A24E683AA999bAe850ddF1B13B2b233135,
        "Sender is not authorized"
    );
    _;
}

    constructor() ERC721("Proof Of Purchase Car", "POP") {} 

    function setBaseURI(string memory baseURI) external onlyAllowedAddresses {
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
