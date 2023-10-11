// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

contract SimpleStorage {
    uint256 private _value;

    event ValueSet(uint256 newValue);

    function setValue(uint256 newValue) external {
        _value = newValue;
        emit ValueSet(newValue);
    }

    function getValue() external view returns (uint256) {
        return _value;
    }
}