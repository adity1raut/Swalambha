const { ethers } = require("ethers");

// Provider (local Hardhat node or any RPC)
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Contract address
const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

// Contract ABI (paste ABI JSON here or import)
const abi = [
  "function getCandidateVotes(uint256 _electionId, string memory _candidateId) view returns (uint256)"
];

// Create contract instance
const election = new ethers.Contract(contractAddress, abi, provider);

async function main() {
  const electionId = 1  ;
  const candidateId = "2023bcs035@sggs.ac.in";

  const votes = await election.getCandidateVotes(electionId, candidateId);
  console.log("Votes:", votes.toString());
}

main();
