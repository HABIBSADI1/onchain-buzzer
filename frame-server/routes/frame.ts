import { Router } from "express";

const router = Router();
const BASE_URL = process.env.FRAME_BASE_URL || "https://frame.finalclick.xyz";

router.get("/", (_req, res) => {
  const imageUrl = `${BASE_URL}/frame-image/image?ts=${Date.now()}`;

  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta property="og:title" content="🔔 Final Click — Buzz to Win!" />
      <meta property="og:description" content="Buzz for 0.00005 ETH. Last click wins the pot!" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:url" content="${BASE_URL}/frame" />

      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${imageUrl}" />

      <meta property="fc:frame:button:1" content="🔥 BUZZ NOW" />
      <meta property="fc:frame:button:1:action" content="tx" />
      <meta property="fc:frame:button:1:target" content="${BASE_URL}/tx" />
      <meta property="fc:frame:button:1:post_url" content="${BASE_URL}/frame" />
    </head>
    <body>
      <h1>🟢 Final Click Frame</h1>
      <p>Meta tags loaded for Farcaster clients.</p>
    </body>
  </html>`;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

export default router;
