import { Router } from "express";

const router = Router();

// دامنه را نرمال کنیم تا اسلش پایانی نداشته باشد
const RAW_BASE = process.env.FRAME_BASE_URL || "https://frame.finalclick.xyz";
const BASE_URL = RAW_BASE.replace(/\/+$/, "");

router.get("/", (_req, res) => {
  const ts = Date.now();
  const imageUrl = `${BASE_URL}/frame-image/image?ts=${ts}`;
  const frameUrl = `${BASE_URL}/frame`;
  const txUrl = `${BASE_URL}/tx`;

  const html = `<!doctype html>
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
  <meta property="fc:frame:post_url" content="${frameUrl}" />

  <!-- TX via URL action -->
  <meta property="fc:frame:button:1" content="🔥 BUZZ NOW" />
  <meta property="fc:frame:button:1:action" content="tx" />
  <meta property="fc:frame:button:1:target" content="${txUrl}" />
</head>
<body style="background:#111;color:#fff;font:16px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;margin:0;padding:24px">
  <h1 style="margin:0 0 8px">🟢 Final Click Frame</h1>
  <p style="opacity:.82">Meta tags loaded for Farcaster clients.</p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.send(html);
});

export default router;
