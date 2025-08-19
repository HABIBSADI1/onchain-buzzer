import { Router } from "express";
import { encodeFunctionData, parseEther } from "viem";
import { abi } from "./abi";

const router = Router();

const CONTRACT_ADDRESS =
  (process.env.VITE_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS) as `0x${string}`;
const CHAIN_ID = process.env.VITE_CHAIN_ID || process.env.CHAIN_ID || "eip155:8453";
const BUZZ_VALUE_ETH = process.env.BUZZ_VALUE_ETH || "0.00005";

// اگر ست شود، params را به شکل آرایه برمی‌گردانیم
const USE_ARRAY_PARAMS = String(process.env.TX_PARAMS_ARRAY || "").toLowerCase() === "true";

const calldata = encodeFunctionData({
  abi,
  functionName: "click",
  args: [],
});

router.post("/", (_req, res) => {
  const valueWei = parseEther(BUZZ_VALUE_ETH).toString();

  const txObject = {
    abi,
    to: CONTRACT_ADDRESS,
    data: calldata,
    value: valueWei, // e.g. "50000000000000"
  };

  const payload =
    USE_ARRAY_PARAMS
      ? {
          method: "eth_sendTransaction",
          chainId: CHAIN_ID,
          params: [txObject], // ← آرایه
        }
      : {
          method: "eth_sendTransaction",
          chainId: CHAIN_ID,
          params: txObject, // ← آبجکت
        };

  res.setHeader("Content-Type", "application/json");
  res.status(200).json(payload);
});

export default router;
