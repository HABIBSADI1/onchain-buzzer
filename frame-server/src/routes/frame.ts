import { Router } from "express";
import { encodeFunctionData, parseEther } from "viem";
import { abi } from "./abi";

const router = Router();

const BASE_URL = process.env.FRAME_BASE_URL || "https://frame.finalclick.xyz";
const CONTRACT_ADDRESS = (process.env.VITE_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS) as `0x${string}`;
const CHAIN_CAIP = (process.env.VITE_CHAIN_ID || process.env.CHAIN_ID || "eip155:8453") as string;
const BUZZ_VALUE_ETH = process.env.BUZZ_VALUE_ETH || "0.00005";

// calldata تابع click()
const calldata = encodeFunctionData({ abi, functionName: "click", args: [] });
// Farcaster value را به صورت "Wei دسیمال" می خواهد (نه هگز/ETH)
const valueWeiDecimal = parseEther(BUZZ_VALUE_ETH).toString();

router.get("/", (_req, res) => {
  const imageUrl = `${BASE_URL}/frame-image/image?ts=${Date.now()}`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Cache-Control" content="no-store" />

  <meta property="og:title" content="🔔 Final Click — Buzz to Win!" />
  <meta property="og:description" content="Buzz for 0.00005 ETH. Last click wins the pot!" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:url" content="${BASE_URL}/frame" />

  <!-- Frames vNext -->
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${imageUrl}" />
  <meta property="fc:frame:post_url" content="${BASE_URL}/frame" />

  <!-- TX از طریق متاتگ‌ها -->
  <meta property="fc:frame:button:1" content="🔥 BUZZ NOW" />
  <meta property="fc:frame:button:1:action" content="tx" />
  <meta property="fc:frame:button:1:target" content="${CHAIN_CAIP}:${CONTRACT_ADDRESS}" />
  <meta property="fc:frame:button:1:data" content="${calldata}" />
  <meta property="fc:frame:button:1:value" content="${valueWeiDecimal}" />
</head>
<body style="background:#111;color:#fff;font:16px system-ui;padding:24px">
  <h1>Final Click Frame</h1>
  <p>Meta tags loaded for Farcaster clients (Meta-TX mode).</p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "no-store");
  res.send(html);
});

export default router;
