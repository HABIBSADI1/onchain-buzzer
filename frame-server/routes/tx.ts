import { Router } from "express";
import { encodeFunctionData, parseEther } from "viem";
import { abi } from "./abi";

const router = Router();

const CONTRACT_ADDRESS =
  (process.env.VITE_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS) as `0x${string}`;
const RAW_CHAIN_ID = process.env.VITE_CHAIN_ID || process.env.CHAIN_ID || "8453";
const BUZZ_VALUE_ETH = process.env.BUZZ_VALUE_ETH || "0.00005";

// پیش‌فرض: طبق JSON-RPC
const METHOD: "eth_sendTransaction" | "wallet_sendEthereumTransaction" =
  (process.env.TX_METHOD as any) || "eth_sendTransaction";

// chainId عددی
function toNumericChainId(raw: string) {
  const m = String(raw).match(/(\d+)$/);
  return m ? Number(m[1]) : Number(raw);
}

const calldata = encodeFunctionData({ abi, functionName: "click", args: [] });

router.post("/", (_req, res) => {
  const chainId = toNumericChainId(RAW_CHAIN_ID);          // 8453 (number)
  const valueWei = parseEther(BUZZ_VALUE_ETH).toString();  // "50000000000000" (decimal)

  const tx = {
    to: CONTRACT_ADDRESS,
    data: calldata,
    value: valueWei, // decimal wei
  };

  const payload = {
    method: METHOD,              // eth_sendTransaction (قابل تغییر با ENV)
    chainId,                     // 8453 (number)
    params: [tx],                // ← آرایه‌ی تک‌عنصری
  };

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(payload);
});

export default router;
