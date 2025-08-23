// frame-server/routes/tx.ts

import { Router } from "express";
import { encodeFunctionData, parseEther } from "viem";
import { abi } from "./abi";

const router = Router();

// ENV variables
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as `0x${string}`;
const CLICK_FEE_ETH = process.env.BUZZ_VALUE_ETH || "0.00005";
const CHAIN_ID = "eip155:8453"; // Base chain

if (!CONTRACT_ADDRESS) {
  throw new Error("❌ VITE_CONTRACT_ADDRESS is not defined in .env");
}

const calldata = encodeFunctionData({
  abi,
  functionName: "click",
  args: [],
});

router.post("/", (_req, res) => {
  console.log("✅ /tx endpoint hit");

  const valueInWeiHex = "0x" + parseEther(CLICK_FEE_ETH).toString(16);

  const payload = {
    chainId: CHAIN_ID,
    method: "eth_sendTransaction",
    params: [
      {
        to: CONTRACT_ADDRESS,
        data: calldata,
        value: valueInWeiHex,
      },
    ],
  };

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(payload);
});

export default router;
