import { Router } from "express";
import { encodeFunctionData, parseEther } from "viem";
import { abi } from "./abi";

const router = Router();

const CONTRACT_ADDRESS =
  (process.env.VITE_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS) as `0x${string}`;
const RAW_CHAIN_ID = process.env.VITE_CHAIN_ID || process.env.CHAIN_ID || "eip155:8453";
const BUZZ_VALUE_ETH = process.env.BUZZ_VALUE_ETH || "0.00005";

function normalizeChainIdNumber(): number {
  const m = String(RAW_CHAIN_ID).match(/(\d+)$/);
  return m ? Number(m[1]) : Number(RAW_CHAIN_ID);
}

const calldata = encodeFunctionData({ abi, functionName: "click", args: [] });

router.post("/", (_req, res) => {
  const chainId = normalizeChainIdNumber(); // ← 8453
  const valueWei = parseEther(BUZZ_VALUE_ETH).toString(); // ← "50000000000000"

  const payload = {
    method: "eth_sendTransaction",
    chainId,                               // ← 8453 (number)
    params: [
      {
        to: CONTRACT_ADDRESS,
        data: calldata,
        value: valueWei,                    // ← decimal string (NOT hex)
      },
    ],
  };

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(payload);
});

export default router;
