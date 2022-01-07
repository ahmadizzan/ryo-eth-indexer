//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract DummyExchange {
    event Transaction(address buyer, string currency, string amount);

    function transact(string calldata currency, string calldata amount) external {
        emit Transaction(msg.sender, currency, amount);
    }
}
