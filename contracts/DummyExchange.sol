//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract DummyExchange {
    event Transaction(address buyer, string currency, string amount);

    function transact() external {
        string memory currency = "eth";
        string memory amount = "0.1";
        emit Transaction(msg.sender, currency, amount);
    }
}
