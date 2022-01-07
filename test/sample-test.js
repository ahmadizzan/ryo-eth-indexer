const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DummyExchange", function () {
  it("should emit `Transaction` event when calling `transact()`", async function () {
    const DummyExchange = await ethers.getContractFactory("DummyExchange");
    const dummyExchange = await DummyExchange.deploy();
    await dummyExchange.deployed();

    const tx = await dummyExchange.transact();
    await tx.wait();
    expect(tx).to.emit(dummyExchange, "Transaction");
  });
});
