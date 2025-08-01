import { Router } from "express";
import { encodeFunctionData, parseEther } from "viem";
import { abi } from "./abi";

const router = Router();

const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as `0x${string}`;
const CHAIN_ID = "eip155:8453";

const calldata = encodeFunctionData({
  abi,
  functionName: "click",
  args: [],
});

router.post("/", (_req, res) => {
  console.log("✅ /tx hit");
  res.json({
    chainId: CHAIN_ID,
    method: "eth_sendTransaction",
    params: [
      {
        to: CONTRACT_ADDRESS,
        data: calldata,
        value: parseEther("0.00005").toString(16),
      },
    ],
  });
});

export default router;
