// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "forge-contracts/contracts/Script.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "../contracts/ERC6551RegistryImpl.sol";

contract ComputeRegistryAddress is Script {
    function run() external view {
        address registry = Create2.computeAddress(
            0x6551655165516551655165516551655165516551655165516551655165516551,
            keccak256(type(ERC6551RegistryImpl).creationCode),
            0x4e59b44847b379578588920cA78FbF26c0B4956C
        );

        console.log(registry);
 
    }
}