import { Router } from "express";
import { encodeFunctionData, parseEther } from "viem";
import { abi } from "./abi";

const router = Router();

const RAW_BASE = process.env.FRAME_BASE_URL || "https://frame.finalclick.xyz";
const BASE_URL = RAW_BASE.replace(/\/+$/, "");
const CONTRACT = (process.env.VITE_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS) as `0x${string}`;
const CHAIN_CAIP = (process.env.VITE_CHAIN_ID || process.env.CHAIN_ID || "eip155:8453") as string;
const BUZZ_VALUE_ETH = process.env.BUZZ_VALUE_ETH || "0.00005";

const calldata = encodeFunctionData({ abi, functionName: "click", args: [] });
const valueWei = parseEther(BUZZ_VALUE_ETH).toString();

router.get("/", (_req, res) => {
  const ts = Date.now();
  const imageUrl = `${BASE_URL}/frame-image/image?ts=${ts}`;
  const frameUrl = `${BASE_URL}/frame`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:url" content="${frameUrl}" />

  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${imageUrl}" />
  <meta property="fc:frame:post_url" content="${frameUrl}" />

  <!-- Meta-TX: بدون /tx -->
  <meta property="fc:frame:button:1" content="🔥 BUZZ NOW" />
  <meta property="fc:frame:button:1:action" content="tx" />
  <meta property="fc:frame:button:1:target" content="${CHAIN_CAIP}:${CONTRACT}" />
  <meta property="fc:frame:button:1:data" content="${calldata}" />
  <meta property="fc:frame:button:1:value" content="${valueWei}" />
</head>
<body style="background:#111;color:#fff;font:16px system-ui;-webkit-font-smoothing:antialiased;margin:0;padding:24px">
  <h1 style="margin:0 0 8px">🟢 Final Click Frame</h1>
  <p style="opacity:.8">Meta tags loaded for Farcaster clients.</p>
</body>
</html>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.send(html);
});

export default router;
