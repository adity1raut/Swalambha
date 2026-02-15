import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { sendUserOpFunc } from "./sendUserOp.js";
import Voter from "../../models/Voter.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const RPC_URL = "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(RPC_URL);

const ENTRYPOINT = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const PAYMASTER = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const FACTORY = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const TOKEN = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
const ELECTION = "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE";

const ACCOUNTS_FILE = path.join(__dirname, "accounts.json");
const PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// ABIs
const entryPointAbi = [
  "function getNonce(address sender, uint192 key) view returns (uint256)",
  "function depositTo(address account) payable",
  "function balanceOf(address account) view returns (uint256)",
  "function handleOps(tuple(address sender,uint256 nonce,bytes initCode,bytes callData,uint256 callGasLimit,uint256 verificationGasLimit,uint256 preVerificationGas,uint256 maxFeePerGas,uint256 maxPriorityFeePerGas,bytes paymasterAndData,bytes signature)[] ops, address payable beneficiary)",
];

const factoryAbi = ["function createAccount(address owner) returns (address)"];

const accountAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_owner",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "count",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "validateUserOp",
    inputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "sender", type: "address" },
          { name: "nonce", type: "uint256" },
          { name: "initCode", type: "bytes" },
          { name: "callData", type: "bytes" },
          { name: "callGasLimit", type: "uint256" },
          { name: "verificationGasLimit", type: "uint256" },
          { name: "preVerificationGas", type: "uint256" },
          { name: "maxFeePerGas", type: "uint256" },
          { name: "maxPriorityFeePerGas", type: "uint256" },
          { name: "paymasterAndData", type: "bytes" },
          { name: "signature", type: "bytes" },
        ],
        internalType: "struct UserOperation",
      },
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "validationData",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "execute",
    inputs: [
      {
        name: "dest",
        type: "address",
        internalType: "address",
      },
      {
        name: "value",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "functionData",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "error",
    name: "MinimalAccount__CallFailed",
    inputs: [
      {
        name: "",
        type: "bytes",
        internalType: "bytes",
      },
    ],
  },
];

const tokenAbi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
        internalType: "address",
        name: "_voter",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "currentElectionId",
        type: "uint256",
      },
    ],
    name: "burnAfterVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "currentElectionId",
        type: "uint256",
      },
    ],
    name: "mintAuthorizedVoters",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
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
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
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
    name: "totalSupply",
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
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
    ],
    name: "voterElectionId",
    outputs: [
      {
        internalType: "uint256",
        name: "electionId",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const electionAbi = [
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
// Helper functions for account storage
function loadAccounts() {
  try {
    if (fs.existsSync(ACCOUNTS_FILE)) {
      const data = fs.readFileSync(ACCOUNTS_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error loading accounts:", err);
  }
  return {};
}

function saveAccount(email, accountData) {
  const accounts = loadAccounts();
  accounts[email] = accountData;
  fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
}

function getAccount(email) {
  const accounts = loadAccounts();
  return accounts[email] || null;
}

/**
 * Deploy a minimal account abstraction wallet for a given email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Deployment result with account address and owner details
 */
export async function deployMinimalAccount(email) {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    console.log("\n=== Starting Account Deployment ===");
    console.log("Email:", email);

    // Generate deterministic private key from email
    const emailBytes = ethers.toUtf8Bytes(email.toLowerCase().trim());
    const privateKey = ethers.keccak256(emailBytes);
    const owner = new ethers.Wallet(privateKey, provider);

    console.log("Owner address:", owner.address);

    // Initialize contracts
    const entryPointContract = new ethers.Contract(
      ENTRYPOINT,
      entryPointAbi,
      provider,
    );
    const factoryContract = new ethers.Contract(FACTORY, factoryAbi, provider);

    // Check if account already exists
    let existingAccount = getAccount(email);

    if (existingAccount) {
      console.log("✅ Account already exists for this email");
      return {
        success: true,
        alreadyExists: true,
        email: email,
        accountAddress: existingAccount.accountAddress,
        ownerAddress: existingAccount.ownerAddress,
        deployedAt: existingAccount.deployedAt,
      };
    }

    console.log("Deploying new Account...");

    // Predict account address
    const factoryNonce = await provider.getTransactionCount(FACTORY);
    console.log("Factory nonce:", factoryNonce);

    const accountAddress = ethers.getCreateAddress({
      from: FACTORY,
      nonce: factoryNonce,
    });

    console.log("Predicted account address:", accountAddress);

    // Deploy the account
    const factoryWithSigner = factoryContract.connect(wallet);
    const deployTx = await factoryWithSigner.createAccount(owner.address);
    console.log("Deployment transaction sent:", deployTx.hash);

    const receipt = await deployTx.wait();
    console.log("✅ Account deployed!");
    console.log("Gas used:", receipt.gasUsed.toString());

    // Ensure paymaster is funded
    const paymasterBalance = await entryPointContract.balanceOf(PAYMASTER);
    console.log(
      "Paymaster balance:",
      ethers.formatEther(paymasterBalance),
      "ETH",
    );

    if (paymasterBalance < ethers.parseEther("1")) {
      console.log("Funding paymaster...");
      // Get fresh nonce to avoid nonce issues
      const currentNonce = await provider.getTransactionCount(
        wallet.address,
        "latest",
      );
      console.log("Current wallet nonce:", currentNonce);

      const fundPaymasterTx = await entryPointContract
        .connect(wallet)
        .depositTo(PAYMASTER, {
          value: ethers.parseEther("100"),
          nonce: currentNonce, // Explicitly set nonce
        });
      console.log("✅ Paymaster funded with 100 ETH", fundPaymasterTx);
    }

    // Save account data
    const accountData = {
      accountAddress: accountAddress,
      ownerAddress: owner.address,
      deployedAt: new Date().toISOString(),
      deploymentTxHash: deployTx.hash,
      gasUsed: receipt.gasUsed.toString(),
    };

    saveAccount(email, accountData);
    console.log("✅ Account data saved");
    const electionContract = new ethers.Contract(
      ELECTION,
      electionAbi,
      provider,
    );
    const currentElectionId = await electionContract.getelectionIdCounter();
    console.log("Current Election ID:", currentElectionId.toString());
    const tokenContract = new ethers.Contract(TOKEN, tokenAbi, provider);

    // Get fresh nonce to avoid conflicts
    const mintNonce = await provider.getTransactionCount(
      wallet.address,
      "latest",
    );

    // Convert currentElectionId to BigInt and compare
    if (currentElectionId > 1n) {
      const tokenWithSigner = tokenContract.connect(wallet);

      // Subtract 1n (BigInt) from currentElectionId (BigInt)
      const electionIdToMint = currentElectionId - 1n;

      const mintTx = await tokenWithSigner.mintAuthorizedVoters(
        accountAddress,
        electionIdToMint, // Pass BigInt directly
        {
          nonce: mintNonce,
        },
      );

      await mintTx.wait();
      console.log("Tokens minted successfully");

      const tokenBalance = await tokenContract.balanceOf(accountAddress);
      console.log("Token balance:", ethers.formatEther(tokenBalance), "tokens");
    }

    return {
      success: true,
      alreadyExists: false,
      email: email,
      accountAddress: accountAddress,
      ownerAddress: owner.address,
      deploymentTxHash: deployTx.hash,
      gasUsed: receipt.gasUsed.toString(),
      deployedAt: accountData.deployedAt,
    };
  } catch (err) {
    console.error("❌ Error deploying account:", err.message);
    console.error("Stack:", err.stack);

    throw {
      success: false,
      error: err.message,
      code: err.code,
      data: err.data,
    };
  }
}

/**
 * Get account information for an email
 * @param {string} email - User's email address
 * @returns {Object|null} Account data or null if not found
 */
export function getAccountByEmail(email) {
  if (!email) {
    return null;
  }
  return getAccount(email.toLowerCase().trim());
}

/**
 * Get the owner wallet for an email
 * @param {string} email - User's email address
 * @returns {ethers.Wallet} Owner wallet
 */
export function getOwnerWallet(email) {
  if (!email) {
    throw new Error("Email is required");
  }

  const emailBytes = ethers.toUtf8Bytes(email.toLowerCase().trim());
  const privateKey = ethers.keccak256(emailBytes);
  return new ethers.Wallet(privateKey, provider);
}

// Example usage (commented out)
/*
// Deploy an account
const result = await deployMinimalAccount("user@example.com");
console.log(result);

// Get existing account
const account = getAccountByEmail("user@example.com");
console.log(account);

// Get owner wallet
const ownerWallet = getOwnerWallet("user@example.com");
console.log("Owner address:", ownerWallet.address);
*/

export async function createElectionOnchain(
  email,
  position,
  regStart,
  regEnd,
  electionStart,
  electionEnd,
) {
  const electionAbi = [
    "function createElection(string,uint256,uint256,uint256,uint256,address)",
  ];
  const iface = new ethers.Interface(electionAbi);
  const regStartTs = Math.floor(new Date(regStart).getTime() / 1000);
  const regEndTs = Math.floor(new Date(regEnd).getTime() / 1000);
  const electionStartTs = Math.floor(new Date(electionStart).getTime() / 1000);
  const electionEndTs = Math.floor(new Date(electionEnd).getTime() / 1000);

  const encodedData = iface.encodeFunctionData("createElection", [
    position,
    regStartTs,
    regEndTs,
    electionStartTs,
    electionEndTs,
    TOKEN,
  ]);

  return await sendUserOpFunc(email, encodedData, ELECTION);
}

export const addCandidate = async (req, res) => {
  try {
    const { electionId, email } = req.body;

    const abi = ["function addCandidate(uint256 _electionId, string _email)"];

    const iface = new ethers.Interface(abi);

    // Ensure correct numeric type
    const encodedData = iface.encodeFunctionData("addCandidate", [
      Number(electionId),
      email,
    ]);

    const result = await sendUserOpFunc(
      email, // smart account owner
      encodedData, // encoded contract call
      ELECTION, // contract address
    );

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Add candidate error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
export const castVote = async (req, res) => {
  try {
    const { electionId, candidateEmail, email } = req.body;

    // 1. Find the voter by email
    const voter = await Voter.findOne({ email: email });

    if (!voter) {
      return res.status(404).json({
        success: false,
        error: "Voter not found",
      });
    }

    // 2. Check if voter has already voted
    // if (voter.hasVoted) {
    //   return res.status(400).json({
    //     success: false,
    //     error: "You have already cast your vote for this election",
    //   });
    // }

    // 3. Prepare blockchain transaction
    const abi = [
      "function vote(uint256 _electionId, string memory _candidateId)",
    ];
    const iface = new ethers.Interface(abi);

    const encodedData = iface.encodeFunctionData("vote", [
      Number(electionId),
      candidateEmail,
    ]);
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

    // Contract address
    const contractAddress = "0x0E801D84Fa97b50751Dbf25036d067dCf18858bF";
    const election = new ethers.Contract(contractAddress, abi, provider);
    const wallet = new ethers.Wallet(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      provider,
    );
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    // 4. Call vote function
    const tx = await contract.vote(Number(electionId), candidateEmail);
    const receipt = await tx.wait(); // Wait for confirmation

    console.log("Transaction hash:", receipt.transactionHash);

    // 4. Execute blockchain transaction
    const result = await sendUserOpFunc(
      email, // smart account owner
      encodedData, // encoded contract call
      ELECTION, // contract address
    );

    return res.status(200).json({
      success: true,
      result,
      message: "Vote cast successfully",
    });
  } catch (error) {
    console.error("Cast vote error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
