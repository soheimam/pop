// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "./ERC6551Registry.sol";
import "./Create2.sol";
import "hardhat/console.sol";

contract ComputeRegistryAddress {
    
    bytes32 constant SALT = 0x6551655165516551655165516551655165516551655165516551655165516551;
    address constant DEPLOYER = 0x4e59b44847b379578588920cA78FbF26c0B4956C;

    function run() public pure returns (address) {
        bytes memory bytecode = type(ERC6551Registry).creationCode;
        bytes32 bytecodeHash = keccak256(abi.encodePacked(bytecode));
        address expectedAddress = address(uint160(uint256(keccak256(abi.encodePacked(
            bytes1(0xff),
            DEPLOYER,
            SALT,
            bytecodeHash
        )))));

        console.log("Computed Registry Address: %s", expectedAddress);
        return expectedAddress;
    }
}
