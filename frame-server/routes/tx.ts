import { Router } from "express";
import { encodeFunctionData, parseEther } from "viem";
import { abi } from "./abi";

const router = Router();

// گرفتن ENVها (هر کدام با دو کلید برای سازگاری)
const CONTRACT_ADDRESS =
  (process.env.VITE_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS) as `0x${string}`;
const RAW_CHAIN_ID = (process.env.VITE_CHAIN_ID || process.env.CHAIN_ID || "eip155:8453") as string;
const BUZZ_VALUE_ETH = process.env.BUZZ_VALUE_ETH || "0.00005";

// متد قابل سوییچ با ENV (پیش‌فرض طبق داک رسمی)
const METHOD = (process.env.TX_METHOD || "eth_sendTransaction") as
  | "eth_sendTransaction"
  | "wallet_sendEthereumTransaction";

function toCaipChainId(raw: string) {
  return raw.startsWith("eip155:") ? raw : `eip155:${raw}`;
}

const calldata = encodeFunctionData({
  abi,
  functionName: "click",
  args: [],
});

router.post("/", (_req, res) => {
  // Spec اصلی: chainId بصورت CAIP
  const chainId = toCaipChainId(RAW_CHAIN_ID);

  // value باید رشته‌ی دسیمال Wei باشد
  const valueWei = parseEther(BUZZ_VALUE_ETH).toString();

  const payload = {
    method: METHOD,
    chainId, // مثلا "eip155:8453"
    params: {
      to: CONTRACT_ADDRESS,
      data: calldata,
      value: valueWei, // "50000000000000"
    },
  };

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(payload);
});

export default router;
