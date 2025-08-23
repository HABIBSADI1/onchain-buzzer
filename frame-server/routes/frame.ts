// buzzerbase/frame-server/routes/frame.ts

import { Router } from "express";
import { encodeFunctionData } from "viem";
import { abi } from "./abi";

const router = Router();

const baseUrl = "https://frame.finalclick.xyz"; // مطمئن شو با دامنه واقعی پروژه‌ت یکیه
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as `0x${string}`;
const CLICK_FEE = "0.00005";

router.get("/", (_req, res) => {
  const imageUrl = `${baseUrl}/frame-image/image?ts=${Date.now()}`;

  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta property="og:title" content="🔔 Final Click — Buzz to Win!" />
      <meta property="og:description" content="Buzz for ${CLICK_FEE} ETH. Last click wins the pot!" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:url" content="${baseUrl}/frame" />

      <meta name="fc:frame" content="vNext" />
      <meta name="fc:frame:image" content="${imageUrl}" />
      <meta name="fc:frame:post_url" content="${baseUrl}/tx" />
      <meta name="fc:frame:button:1" content="Buzz to Win" />
    </head>
    <body></body>
  </html>`;

  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(html);
});

export default router;
