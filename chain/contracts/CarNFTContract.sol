import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CarNFT is ERC721 {

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {

    }

    function sayHello() public returns (string memory) {
        return "Hello World";
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

}