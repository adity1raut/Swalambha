import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RPC_URL = "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(RPC_URL);

const ENTRYPOINT = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const PAYMASTER = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const FACTORY = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const TOKEN = "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE";
const ELECTION = "0x59b670e9fA9D0A427751Af201D676719a970857b";

const ACCOUNTS_FILE = path.join(__dirname, "accounts.json");
const PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const entryPointAbi = [
  "function getNonce(address sender, uint192 key) view returns (uint256)",
  "function depositTo(address account) payable",
  "function balanceOf(address account) view returns (uint256)",
  "function handleOps(tuple(address sender,uint256 nonce,bytes initCode,bytes callData,uint256 callGasLimit,uint256 verificationGasLimit,uint256 preVerificationGas,uint256 maxFeePerGas,uint256 maxPriorityFeePerGas,bytes paymasterAndData,bytes signature)[] ops, address payable beneficiary)",
];

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

function getAccountByEmail(email) {
  const accounts = loadAccounts();
  const normalizedEmail = email.toLowerCase().trim();
  return accounts[normalizedEmail] || null;
}

/**
 * Send a UserOperation using the minimal account associated with an email
 * @param {string} email - User's email address
 * @param {string} encodedFunctionData - Encoded function call data
 * @param {string} contractAddress - Target contract address (e.g., Election contract)
 * @returns {Promise<Object>} Transaction result
 */
export async function sendUserOpFunc(email, encodedFunctionData, contractAddress) {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    if (!encodedFunctionData) {
      throw new Error("Encoded function data is required");
    }

    if (!contractAddress) {
      throw new Error("Contract address is required");
    }

    console.log("\n=== Starting UserOp Creation ===");
    console.log("Email:", email);
    console.log("Contract Address:", contractAddress);

    // Get account address from accounts.json using email
    const accountData = getAccountByEmail(email);

    if (!accountData) {
      throw new Error(
        `No account found for email: ${email}. Please deploy an account first.`,
      );
    }

    const accountAddress = accountData.accountAddress;
    console.log("Account Address:", accountAddress);
    console.log("Owner Address:", accountData.ownerAddress);

    // Generate owner wallet from email (same as deployment)
    const emailBytes = ethers.toUtf8Bytes(email.toLowerCase().trim());
    const privateKey = ethers.keccak256(emailBytes);
    const owner = new ethers.Wallet(privateKey, provider);

    console.log("Regenerated Owner address:", owner.address);

    // Verify owner address matches
    if (
      owner.address.toLowerCase() !== accountData.ownerAddress.toLowerCase()
    ) {
      throw new Error("Owner address mismatch. Account may be compromised.");
    }

    // Initialize EntryPoint contract
    const entryPointContract = new ethers.Contract(
      ENTRYPOINT,
      entryPointAbi,
      provider,
    );

    // Ensure paymaster is funded
    const paymasterBalance = await entryPointContract.balanceOf(PAYMASTER);
    console.log(
      "Paymaster balance:",
      ethers.formatEther(paymasterBalance),
      "ETH",
    );

    if (paymasterBalance < ethers.parseEther("1")) {
      console.log("Funding paymaster...");

      const currentNonce = await provider.getTransactionCount(
        wallet.address,
        "latest",
      );

      const fundPaymasterTx = await entryPointContract
        .connect(wallet)
        .depositTo(PAYMASTER, {
          value: ethers.parseEther("100"),
          nonce: currentNonce,
        });
      await fundPaymasterTx.wait();
      console.log("✅ Paymaster funded with 100 ETH");
    }

    // Prepare callData for the minimal account's execute function
    const accountIface = new ethers.Interface(accountAbi);
    const callData = accountIface.encodeFunctionData("execute", [
      contractAddress,
      0, // value (0 ETH)
      encodedFunctionData,
    ]);

    console.log("CallData:", callData);

    // Get nonce for the account
    const nonce = await entryPointContract.getNonce(accountAddress, 0);
    console.log("Nonce:", nonce.toString());

    // Build UserOp
    const userOp = {
      sender: accountAddress,
      nonce: nonce,
      initCode: "0x",
      callData: callData,
      callGasLimit: 200_000,
      verificationGasLimit: 200_000,
      preVerificationGas: 50_000,
      maxFeePerGas: ethers.parseUnits("10", "gwei"),
      maxPriorityFeePerGas: ethers.parseUnits("5", "gwei"),
      paymasterAndData: PAYMASTER,
      signature: "0x",
    };

    console.log("\n=== UserOp Details ===");
    console.log("Sender:", userOp.sender);
    console.log("Nonce:", userOp.nonce.toString());
    console.log("InitCode:", userOp.initCode);
    console.log(
      "CallData (truncated):",
      userOp.callData.substring(0, 66) + "...",
    );
    console.log("CallGasLimit:", userOp.callGasLimit.toString());
    console.log(
      "VerificationGasLimit:",
      userOp.verificationGasLimit.toString(),
    );
    console.log("PreVerificationGas:", userOp.preVerificationGas.toString());
    console.log(
      "MaxFeePerGas:",
      ethers.formatUnits(userOp.maxFeePerGas, "gwei"),
      "gwei",
    );
    console.log(
      "MaxPriorityFeePerGas:",
      ethers.formatUnits(userOp.maxPriorityFeePerGas, "gwei"),
      "gwei",
    );
    console.log("PaymasterAndData:", userOp.paymasterAndData);
    console.log("Signature:", userOp.signature);

    // Get count before (if available)
    const accountContract = new ethers.Contract(
      accountAddress,
      accountAbi,
      provider,
    );

    let countBefore = "N/A";
    try {
      const count = await accountContract.count();
      countBefore = count.toString();
      console.log("\nCount before:", countBefore);
    } catch (err) {
      console.log("Could not fetch count (might not exist on this account)");
    }

    // Send UserOp
    console.log("\n=== Sending UserOp ===");
    const entryPointWithSigner = entryPointContract.connect(wallet);

    try {
      // Set explicit gas limit to prevent estimation failure
      const tx = await entryPointWithSigner.handleOps(
        [userOp],
        wallet.address,
        {
          gasLimit: 3_000_000,
        },
      );

      console.log("Transaction sent:", tx.hash);

      const receipt = await tx.wait();
      console.log("✅ Transaction confirmed!");
      console.log("Gas used:", receipt.gasUsed.toString());

      // Get count after (if available)
      let countAfter = "N/A";
      try {
        const count = await accountContract.count();
        countAfter = count.toString();
        console.log("Count after:", countAfter);
      } catch (err) {
        console.log("Could not fetch count after");
      }

      // Parse events
      const events = receipt.logs
        .map((log) => {
          try {
            return entryPointContract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .filter((e) => e !== null);

      console.log("\n=== Events ===");
      events.forEach((event) => {
        console.log(`- ${event.name}`);
      });

      return {
        success: true,
        email: email,
        accountAddress: accountAddress,
        txHash: tx.hash,
        ownerAddress: owner.address,
        contractAddress: contractAddress,
        countBefore: countBefore,
        countAfter: countAfter,
        paymasterUsed: PAYMASTER,
        gasUsed: receipt.gasUsed.toString(),
        events: events.map((e) => e.name),
      };
    } catch (txError) {
      console.error("❌ Transaction error:", txError);

      // Try to decode the error
      if (txError.data) {
        console.error("Error data:", txError.data);

        try {
          const errorIface = new ethers.Interface([
            "error FailedOp(uint256 opIndex, string reason)",
          ]);
          const decodedError = errorIface.parseError(txError.data);
          console.error("Decoded error:", decodedError);
        } catch (e) {
          console.error("Could not decode error");
        }
      }

      throw txError;
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
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
 * Get account information by email
 * @param {string} email - User's email address
 * @returns {Object|null} Account data or null
 */
export function getAccountInfo(email) {
  return getAccountByEmail(email);
}

/**
 * Check if an account exists for an email
 * @param {string} email - User's email address
 * @returns {boolean} True if account exists
 */
export function accountExists(email) {
  return getAccountByEmail(email) !== null;
}

// Example usage (commented out)
/*
import { Election } from "./electionAbi.js"; // Your election ABI

// Example: Vote for a candidate
const electionInterface = new ethers.Interface(Election.abi);
const encodedVoteData = electionInterface.encodeFunctionData("vote", [
  1, // electionId
  "candidate@example.com" // candidateId
]);

const result = await sendUserOp(
  "voter@example.com",
  encodedVoteData,
  "0x68B1D87F95878fE05B998F19b66F4baba5De1aed" // Election contract address
);

console.log("Vote transaction:", result.txHash);
*/
