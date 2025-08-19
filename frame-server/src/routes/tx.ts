import { Router } from "express";
import { encodeFunctionData, parseEther } from "viem";
import { abi } from "./abi";

const router = Router();

const CONTRACT_ADDRESS =
  (process.env.VITE_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS) as `0x${string}`;
const RAW_CHAIN_ID = process.env.VITE_CHAIN_ID || process.env.CHAIN_ID || "eip155:8453";
const BUZZ_VALUE_ETH = process.env.BUZZ_VALUE_ETH || "0.00005";

// متد پیش‌فرضی که با Warpcast خوب جواب می‌دهد
const METHOD = (process.env.TX_METHOD || "wallet_sendEthereumTransaction") as
  | "wallet_sendEthereumTransaction"
  | "eth_sendTransaction";

function numericChainId(raw: string): number {
  const m = String(raw).match(/(\d+)$/);
  return m ? Number(m[1]) : Number(raw);
}

const calldata = encodeFunctionData({
  abi,
  functionName: "click",
  args: [],
});

router.post("/", (_req, res) => {
  const chainId = numericChainId(RAW_CHAIN_ID);           // ← 8453
  const valueWei = parseEther(BUZZ_VALUE_ETH).toString(); // ← "50000000000000" (decimal)

  // ← params = OBJECT  (نه آرایه) ، بدون abi ، value به صورت ویِ دسیمال
  const payload = {
    method: METHOD,
    chainId,
    params: {
      to: CONTRACT_ADDRESS,
      data: calldata,
      value: valueWei,
    },
  };

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(payload);
});

export default router;
