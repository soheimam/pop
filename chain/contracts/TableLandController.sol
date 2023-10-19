// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10 <0.9.0;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {TablelandDeployments} from "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import {SQLHelpers} from "@tableland/evm/contracts/utils/SQLHelpers.sol";

contract PopTablelandUser is Ownable {
    // Store relevant table info
    uint256 public tableId = 7884; // Unique table ID
    string private constant _TABLE_PREFIX = "cli_pop_table"; // Custom table prefix

    // Constructor that creates a simple table with a an `id` and `val` column
    constructor() {
    }

    // Let anyone insert into the table
    function insertIntoTable(string memory val) external {
        TablelandDeployments.get().mutate(
            address(this), // Table owner, i.e., this contract
            tableId,
            SQLHelpers.toInsert(
                _TABLE_PREFIX,
                tableId,
                "address,val",
                string.concat(
                    SQLHelpers.quote(Strings.toHexString(msg.sender)), // Insert the caller's address
                    ",",
                    SQLHelpers.quote(val) // Wrap strings in single quotes with the `quote` method
                )
            )
        );
    }

    // Update only the row that the caller inserted
    function updateTable(string memory val) external {
        // Set the values to update
        string memory setters = string.concat("val=", SQLHelpers.quote(val));
        // Specify filters for which row to update
        string memory filters = string.concat(
            "address=",
            SQLHelpers.quote(Strings.toHexString(msg.sender))
        );
        // Mutate a row at `address` with a new `val`—gating for the correct row is handled by the controller contract
        TablelandDeployments.get().mutate(
            address(this),
            tableId,
            SQLHelpers.toUpdate(_TABLE_PREFIX, tableId, setters, filters)
        );
    }

    // Set the ACL controller to enable row-level writes with dynamic policies
    function setAccessControl(address controller) external onlyOwner {
        TablelandDeployments.get().setController(
            address(this), // Table owner, i.e., this contract
            tableId,
            controller // Set the controller address—a separate controller contract
        );
    }
}