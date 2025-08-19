import { Router } from "express";
import { encodeFunctionData, parseEther } from "viem";
import { abi } from "./abi";

const router = Router();

const CONTRACT_ADDRESS = (process.env.VITE_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS) as `0x${string}`;
// Read the chain ID from environment.  Accept both CAIP-2 (e.g. "eip155:8453") and
// numeric values (e.g. "8453").  Default to Base mainnet.
const RAW_CHAIN_ID = process.env.VITE_CHAIN_ID || process.env.CHAIN_ID || "eip155:8453";
const BUZZ_VALUE_ETH = process.env.BUZZ_VALUE_ETH || "0.00005";

// Precompute the calldata for the click() function.  This never changes between requests.
const calldata = encodeFunctionData({
  abi,
  functionName: "click",
  args: [],
});

router.post("/", (_req, res) => {
  // Convert the ETH fee to a decimal string of wei.  Farcaster clients expect a
  // decimal string (not hex) for the value field.  Use viem's parseEther to
  // perform the conversion.
  const valueWei = parseEther(BUZZ_VALUE_ETH).toString();
  // chainId should be returned exactly as provided (e.g. "eip155:8453" or "8453").
  // Do not attempt to convert to a number here; Farcaster's schema accepts
  // strings for CAIP‑formatted chain IDs.
  const chainId = RAW_CHAIN_ID;
  // Construct the transaction payload.  Use params as an object (not array) to
  // maximize compatibility with Farcaster clients.
  const payload = {
    method: process.env.TX_METHOD || "wallet_sendEthereumTransaction",
    chainId,
    params: {
      to: CONTRACT_ADDRESS,
      data: calldata,
      value: valueWei,
    },
  };
  res.setHeader("Content-Type", "application/json");
  // Do not cache the JSON response; it should always reflect the latest value.
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.status(200).json(payload);
});

export default router;
