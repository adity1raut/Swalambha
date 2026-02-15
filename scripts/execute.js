const hre = require("hardhat");

const FACTORY_NONCE = 1;
const FACTORT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const ENTRYPOINT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const PM_ADDRESS="0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

async function main() {
  const [signer0] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();

  const ep = await hre.ethers.getContractAt("EntryPoint", ENTRYPOINT_ADDRESS);
  const sender = await hre.ethers.getCreateAddress({
    from: FACTORT_ADDRESS,
    nonce: FACTORY_NONCE,
  });
  console.log(sender);
  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
//   const initCode =
//     FACTORT_ADDRESS +
//     AccountFactory.interface
//       .encodeFunctionData("createAccount", [address0])
//       .slice(2);
  const Account = await hre.ethers.getContractFactory("Account");

  await ep.depositTo(PM_ADDRESS,{
    value:hre.ethers.parseEther("100"),
  })
  const userop = {
    sender,
    nonce: ep.getNonce(sender, 0),
    initCode:"0x",
    callData: Account.interface.encodeFunctionData("execute"),
    callGasLimit: 200_000,
    verificationGasLimit: 200_000,
    preVerificationGas: 50_000,
    maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
    paymasterAndData: PM_ADDRESS,
    signature: "0x",
  };
  const tx = await ep.handleOps([userop], address0);
  const receipt = await tx.wait();
  console.log(receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
