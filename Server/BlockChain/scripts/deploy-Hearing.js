const hze = require("hardhat");
const usingFunction = require("./replacing");

const main = async () => {
  console.log("Started");
  const Hearing = await hze.ethers.getContractFactory("Hearing");
  console.log("Step 1 Done");
  const hearing = await Hearing.deploy();
  console.log("Step 2 Donw");

  await hearing.deployed();
  console.log("Step 3 Done");
  console.log(`Poll deployed to ${hearing.address}`);

  console.log("waiting");
  await hearing.deployTransaction.wait(5);
  console.log("Waited");

  await usingFunction(hearing.address);
};

main().catch((e) => {
  console.log(e);
  process.exitCode = 1;
});

module.exports.tags = ["all", "deploy"];
