const hre=require("hardhat");

const ACCOUNT_ADDRESS="0x5392A33F7F677f59e833FEBF4016cDDD88fF9E67";
async function main() {
   const account=await hre.ethers.getContractAt("Account",ACCOUNT_ADDRESS);
   const count=await account.count();
   console.log(count);
}

main().catch((error)=>{
    console.error(error);
    process.exitCode=1;
});