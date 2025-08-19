import { Router } from "express";
import { encodeFunctionData, parseEther } from "viem";
import { abi } from "./abi";

const router = Router();

const CONTRACT_ADDRESS =
  (process.env.VITE_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS) as `0x${string}`;
const CHAIN_ID = process.env.VITE_CHAIN_ID || process.env.CHAIN_ID || "eip155:8453";
const BUZZ_VALUE_ETH = process.env.BUZZ_VALUE_ETH || "0.00005";

const calldata = encodeFunctionData({
  abi,
  functionName: "click",
  args: [],
});

router.post("/", (_req, res) => {
  const valueWei = parseEther(BUZZ_VALUE_ETH).toString(); // دسیمالِ Wei

  // اسکیمای رسمی: params = OBJECT
  const payload = {
    method: "eth_sendTransaction",
    chainId: CHAIN_ID,
    params: {
      abi,                    // کمک برای نمایش بهتر در کلاینت
      to: CONTRACT_ADDRESS,   // کانترکت بازی
      data: calldata,         // click()
      value: valueWei,        // "50000000000000"
    },
  };

  // اگر لازم شد حالت آرایه‌ای را تست کنی (بعضی کلاینت‌ها قدیمی):
  // const payload = {
  //   method: "eth_sendTransaction",
  //   chainId: CHAIN_ID,
  //   params: [{ abi, to: CONTRACT_ADDRESS, data: calldata, value: valueWei }],
  // };

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(payload);
});

export default router;
