// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require('fs');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const DummyExchange = await ethers.getContractFactory("DummyExchange");
  const dummyExchange = await DummyExchange.deploy();
  await dummyExchange.deployed();

  let [owner] = await ethers.getSigners();

  const deploymentInfo = JSON.stringify({
    'dummyExchange': dummyExchange.address,
    'deployer': owner.address,
  }, null, 2);
  fs.writeFileSync(__dirname + "/../deployment-info.json", deploymentInfo);

  console.log("DummyExchange deployed, deployment info:");
  console.log(deploymentInfo);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
