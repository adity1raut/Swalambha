const hre=require("hardhat");

async function main() {
    const p=await hre.ethers.deployContract("Paymaster");
    await p.waitForDeployment();
    console.log("af",p.target);
}

main().catch((error)=>{
    console.error(error);
    process.exitCode=1;
});