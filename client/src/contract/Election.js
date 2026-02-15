import { ethers } from "ethers";
const abi = [
  {
    inputs: [],
    name: "Election__CandidateAlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "Election__ElectionNotEnded",
    type: "error",
  },
  {
    inputs: [],
    name: "Election__ElectionNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "Election__InvalidElectionDate",
    type: "error",
  },
  {
    inputs: [],
    name: "Election__InvalidRegistrationDate",
    type: "error",
  },
  {
    inputs: [],
    name: "Election__NoCandidates",
    type: "error",
  },
  {
    inputs: [],
    name: "Election__VotingNotActive",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "email",
        type: "string",
      },
    ],
    name: "addCandidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "candidateExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "candidateVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_position",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_regStart",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_regEnd",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_electionStart",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_electionEnd",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "createElection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "electionInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "electionId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "position",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "candidateRegStartDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "candidateRegEndDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "electionStartDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "electionEndDate",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "string",
        name: "winner",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
    ],
    name: "endElection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_candidateId",
        type: "string",
      },
    ],
    name: "getCandidateVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
    ],
    name: "getCandidates",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
    ],
    name: "getElection",
    outputs: [
      {
        internalType: "uint256",
        name: "electionId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "position",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "regStart",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "regEnd",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "electionStart",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "electionEnd",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "string",
        name: "winnerIndex",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
    ],
    name: "getWinner",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getelectionIdCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_candidateId",
        type: "string",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const contractAddress = "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const contract = new ethers.Contract(contractAddress, abi, provider);

export async function getElectionId() {
  try {
    const counter = await contract.getelectionIdCounter();

    // counter is BigInt in ethers v6
    return Number(counter);
  } catch (error) {
    console.error("Error fetching election counter:", error);
    throw error;
  }
}

export async function getAllElections() {
  const promises = [];
  const total = await getElectionId();

  for (let i = 0; i < total; i++) {
    promises.push(contract.getElection(i));
  }

  const results = await Promise.all(promises);

  const elections = results.map((e) => ({
    electionId: Number(e[0]),
    position: e[1],
    regStart: Number(e[2]),
    regEnd: Number(e[3]),
    electionStart: Number(e[4]),
    electionEnd: Number(e[5]),
    token: e[6],
    winner: e[7],
  }));

  return elections.reverse();
}

export async function getCandidates(electionId) {
  try {
    const candidates = await contract.getCandidates(electionId);

    // candidates is already string[]
    return candidates;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw error;
  }
}

export async function getCandidateVotes(electionId, candidateId) {
  try {
    console.log(
      `Fetching votes for election ${electionId}, candidate ${candidateId}`,
    );

    const votes = await contract.getCandidateVotes(
      BigInt(electionId), // ensure uint256
      candidateId, // string (email)
    );

    console.log(`Raw votes from contract:`, votes);

    // Convert BigInt to normal number (if safe)
    const voteCount = Number(votes);
    console.log(`Converted vote count:`, voteCount);

    return voteCount;

    // OR safer if votes may be large:
    // return votes.toString();
  } catch (error) {
    console.error(
      `Error fetching candidate votes for ${candidateId} in election ${electionId}:`,
      error,
    );
    // Return 0 instead of throwing to prevent the entire results from failing
    return 0;
  }
}
