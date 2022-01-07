const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DummyExchange", function () {
  let dummyExchange;

  let owner;
  let users;

  beforeEach(async function () {
    const DummyExchange = await ethers.getContractFactory("DummyExchange");
    dummyExchange = await DummyExchange.deploy();
    await dummyExchange.deployed();

    [owner, ...users] = await ethers.getSigners();
  })

  it("should emit `Transaction` event when calling `transact()`", async function () {
    const tx = await dummyExchange.transact("ETH", "0.1");
    await tx.wait();
    expect(tx)
      .to.emit(dummyExchange, "Transaction")
        .withArgs(owner.address, "ETH", "0.1");
  });
});
