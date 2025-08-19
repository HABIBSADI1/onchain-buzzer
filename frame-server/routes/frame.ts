import { Router } from "express";
const router = Router();
const BASE_URL = process.env.FRAME_BASE_URL || "https://frame.finalclick.xyz";

router.get("/", (_req, res) => {
  const imageUrl = `${BASE_URL}/frame-image/image?ts=${Date.now()}`;

  const html = `<!doctype html><html lang="en"><head>
  <meta charset="utf-8" />
  <meta http-equiv="Cache-Control" content="no-store" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:url" content="${BASE_URL}/frame" />
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${imageUrl}" />
  <meta property="fc:frame:post_url" content="${BASE_URL}/frame" />
  <meta property="fc:frame:button:1" content="🔥 BUZZ NOW" />
  <meta property="fc:frame:button:1:action" content="tx" />
  <meta property="fc:frame:button:1:target" content="${BASE_URL}/tx" />
  </head><body>Final Click Frame</body></html>`;

  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "no-store");
  res.send(html);
});

export default router;
