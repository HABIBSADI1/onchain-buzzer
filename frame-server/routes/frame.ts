import { Router } from "express";
import { encodeFunctionData } from "viem";
import { abi } from "./abi";

const router = Router();

const baseUrl = "https://frame.finalclick.xyz";
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as `0x${string}`;
const CLICK_FEE = "0.00005";

const encodedClickData = encodeFunctionData({
  abi,
  functionName: "click",
  args: [],
});

router.get("/", (_req, res) => {
  const imageUrl = `${baseUrl}/frame-image/image?ts=${Date.now()}`;
  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta property="og:title" content="🔔 Final Click — Buzz to Win!" />
      <meta property="og:description" content="Buzz for 0.00005 ETH. Last click wins the pot!" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:url" content="${baseUrl}/frame" />

      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${imageUrl}" />

      <meta property="fc:frame:button:1" content="🔥 BUZZ NOW" />
      <meta property="fc:frame:button:1:action" content="tx" />
      <meta property="fc:frame:button:1:target" content="eip155:8453:${CONTRACT_ADDRESS}" />
      <meta property="fc:frame:button:1:data" content="${encodedClickData}" />
      <meta property="fc:frame:button:1:value" content="${CLICK_FEE}" />

      <meta http-equiv="refresh" content="15;url=https://finalclick.xyz" />
      <style>
        body {
          font-family: sans-serif;
          background: #111;
          color: #fff;
          text-align: center;
          padding: 3rem;
        }
      </style>
    </head>
    <body>
      <h1>🟢 Frame Meta Loaded</h1>
      <p>If you're seeing this in a browser, the frame meta is for Farcaster clients.</p>
    </body>
  </html>`;
  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

export default router;
