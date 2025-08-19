import { Router } from "express";
import { encodeFunctionData, parseEther } from "viem";
import { abi } from "./abi";

const router = Router();

/**
 * ENV handling
 * - CONTRACT_ADDRESS: آدرس کانترکت
 * - CHAIN_ID: مثل eip155:8453 یا eip155:84532
 * - BUZZ_VALUE_ETH: کارمزد کلیک به ETH (مثلاً 0.00005)
 */
const CONTRACT_ADDRESS =
  (process.env.VITE_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS) as `0x${string}`;
const CHAIN_ID = process.env.VITE_CHAIN_ID || process.env.CHAIN_ID || "eip155:8453";
const BUZZ_VALUE_ETH = process.env.BUZZ_VALUE_ETH || "0.00005";

// calldata برای click()
const calldata = encodeFunctionData({
  abi,
  functionName: "click",
  args: [],
});

// پاسخ اکشن تراکنش مطابق Spec
router.post("/", (_req, res) => {
  const valueWei = parseEther(BUZZ_VALUE_ETH).toString(); // دسیمالِ Wei

  const payload = {
    method: "eth_sendTransaction",
    chainId: CHAIN_ID,
    params: {
      abi,                     // کمک می‌کند کلاینت‌ها UI بهتری نشان دهند
      to: CONTRACT_ADDRESS,    // آدرس کانترکت
      data: calldata,          // تابع click()
      value: valueWei,         // مثل "50000000000000"
    },
  };

  res.setHeader("Content-Type", "application/json");
  res.status(200).json(payload);
});

export default router;
