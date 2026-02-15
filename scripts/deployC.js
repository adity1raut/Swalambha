const hre = require("hardhat");

async function main() {
  // const c = await hre.ethers.deployContract("Token");
  // await c.waitForDeployment();
  // console.log("token1", c.target);
  const e = await hre.ethers.deployContract("ElectionContract");
  await e.waitForDeployment();
  console.log("token", e.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
