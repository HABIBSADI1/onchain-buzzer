import { Router } from "express";
import { encodeFunctionData } from "viem";
import { abi } from "./abi";

const router = Router();

// Use environment variable for base URL if provided, otherwise default to the production
// domain.  Remove any trailing slashes so the generated URLs are consistent.
const RAW_BASE_URL = process.env.FRAME_BASE_URL || "https://frame.finalclick.xyz";
const baseUrl = RAW_BASE_URL.replace(/\/+$/, "");

// When serving the frame meta, use a URL action (targeting the `/tx` endpoint) to
// construct the transaction.  This avoids having to embed call data and ETH
// values directly into the meta tags, which can cause validation errors on
// Farcaster clients.  The `/tx` route will return a properly formatted JSON
// payload describing the transaction.
router.get("/", (_req, res) => {
  const now = Date.now();
  const imageUrl = `${baseUrl}/frame-image/image?ts=${now}`;
  const frameUrl = `${baseUrl}/frame`;
  const txUrl = `${baseUrl}/tx`;

  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0" />
      <meta http-equiv="Pragma" content="no-cache" />
      <meta http-equiv="Expires" content="0" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <meta property="og:title" content="🔔 Final Click — Buzz to Win!" />
      <meta property="og:description" content="Buzz for 0.00005 ETH. Last click wins the pot!" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:url" content="${frameUrl}" />
      <link rel="canonical" href="${frameUrl}" />

      <!-- Frames vNext -->
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${imageUrl}" />
      <!-- After any interaction (cast, tx) refresh this frame so the image and state update -->
      <meta property="fc:frame:post_url" content="${frameUrl}" />

      <!-- Transaction button: uses URL action to POST to /tx -->
      <meta property="fc:frame:button:1" content="🔥 BUZZ NOW" />
      <meta property="fc:frame:button:1:action" content="tx" />
      <meta property="fc:frame:button:1:target" content="${txUrl}" />
    </head>
    <body style="background:#111;color:#fff;font:16px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;margin:0;padding:24px">
      <h1 style="margin:0 0 8px">🟢 Final Click Frame</h1>
      <p style="opacity:.8">Meta tags loaded for Farcaster clients.</p>
    </body>
  </html>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  // Prevent caching of the frame HTML.  While the image is cached at the
  // resource level, the HTML itself should always reflect the latest state.
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.send(html);
});

export default router;
