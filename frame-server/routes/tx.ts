import { Router } from "express";
import { encodeFunctionData, parseEther } from "viem";
import { abi } from "./abi";

const router = Router();

// Read the contract address from either the Vite‑style env variable or the plain
// variable.  Some environments (like the provided .env for this project) set
// CONTRACT_ADDRESS instead of VITE_CONTRACT_ADDRESS.  Fallback to the
// CONTRACT_ADDRESS if the Vite prefixed value is undefined.
const CONTRACT_ADDRESS = (process.env.VITE_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS) as `0x${string}`;

// Use an environment override for the chain ID if available.  Default to
// Base mainnet (eip155:8453) when none is provided.  Developers can supply
// VITE_CHAIN_ID (e.g. "eip155:84532" for Base Sepolia) to switch networks
// without code changes.
const CHAIN_ID = process.env.VITE_CHAIN_ID || process.env.CHAIN_ID || "eip155:8453";

const calldata = encodeFunctionData({
  abi,
  functionName: "click",
  args: [],
});

router.post("/", (_req, res) => {
  console.log("✅ /tx hit");

  // Convert the fee from ETH to Wei as a decimal string.  Farcaster expects
  // the value field in the response to be a string representing the amount in
  // wei (base‑10), not a hex string.  For example, parseEther("0.00005")
  // returns a bigint equal to 50_000_000_000_000 wei.  The `.toString()`
  // call converts it to a decimal string.
  const feeWei = parseEther("0.00005").toString();

  res.json({
    chainId: CHAIN_ID,
    method: "eth_sendTransaction",
    // Include the ABI for the called function in the response.  While not
    // strictly required by the spec, providing the ABI helps Farcaster
    // clients decode the transaction and present more informative signing
    // dialogs.  Only the function selector and any potential error types are
    // needed; here we pass the full ABI defined in routes/abi.ts.
    params: [
      {
        abi,
        to: CONTRACT_ADDRESS,
        data: calldata,
        value: feeWei,
      },
    ],
  });
});

export default router;
