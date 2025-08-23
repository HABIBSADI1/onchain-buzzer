// buzzerbase/frame-server/routes/tx.ts

import { Router } from "express";
import { encodeFunctionData, parseEther } from "viem";
import { abi } from "./abi";

const router = Router();

const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as `0x${string}`;
const CHAIN_ID = "eip155:8453"; // Chain ID شبکه Base
const CLICK_FEE = "0.00005";

const calldata = encodeFunctionData({
  abi,
  functionName: "click",
  args: [],
});

router.post("/", (_req, res) => {
  console.log("✅ /tx hit");

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");

  res.status(200).json({
    chainId: CHAIN_ID,
    method: "eth_sendTransaction",
    params: [
      {
        to: CONTRACT_ADDRESS,
        data: calldata,
        value: "0x" + parseEther(CLICK_FEE).toString(16), // حتماً با 0x شروع بشه
      },
    ],
  });
});

export default router;
