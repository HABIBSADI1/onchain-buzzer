import { Router } from "express";
import { encodeFunctionData } from "viem";
import { abi } from "./abi";

const router = Router();

const baseUrl = "https://frame.finalclick.xyz";
// Pull the contract address from either Vite‑style or plain env variables.  The
// provided .env in this repository uses CONTRACT_ADDRESS, so fall back to it
// when VITE_CONTRACT_ADDRESS is undefined.
const CONTRACT_ADDRESS = (process.env.VITE_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS) as `0x${string}`;

// Read the chain ID from environment variables when available.  Defaults to
// Base mainnet (eip155:8453).  Use VITE_CHAIN_ID or CHAIN_ID to override.
const CHAIN_ID = process.env.VITE_CHAIN_ID || process.env.CHAIN_ID || "eip155:8453";

// The ETH amount required to click in the game.  Farcaster expects the value
// meta tag to be specified in wei (as a decimal string) when using the
// legacy transaction meta tags.  0.00005 ETH equals 50,000,000,000,000 wei
// (5e13).  You can update this constant if the click fee changes.
const CLICK_FEE_WEI = "50000000000000";

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
      <!--
        The target for a tx action uses the CAIP‑10 format of
        chain:address.  We embed the chain ID and contract so that Farcaster can
        construct a call to the contract directly.  When combined with the
        fc:frame:button:$idx:data and value tags below, the wallet knows
        exactly which function to call and with what value.
      -->
      <meta property="fc:frame:button:1:target" content="${CHAIN_ID}:${CONTRACT_ADDRESS}" />
      <!-- The calldata for the click() function on the contract.  Must be
           prefixed with 0x. -->
      <meta property="fc:frame:button:1:data" content="${encodedClickData}" />
      <!-- The amount of wei to send with the transaction.  Farcaster expects a
           decimal string representing wei.  0.00005 ETH = 50,000,000,000,000 wei. -->
      <meta property="fc:frame:button:1:value" content="${CLICK_FEE_WEI}" />

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
