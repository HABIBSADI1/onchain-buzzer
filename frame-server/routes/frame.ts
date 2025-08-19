import { Router } from "express";

const router = Router();

// اگر در Railway ست کردی از همون بخون، وگرنه پیش‌فرض دامنه‌ی تو:
const BASE_URL = process.env.FRAME_BASE_URL || "https://frame.finalclick.xyz";

// این صفحه فقط متاتگ‌ها رو می‌دهد؛ دکمه تراکنش، به /tx می‌زند
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

      <!-- Frame vNext -->
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${imageUrl}" />

      <!-- Button: TX via URL (بدون data/value اینجا؛ از /tx میاد) -->
      <meta property="fc:frame:button:1" content="🔥 BUZZ NOW" />
      <meta property="fc:frame:button:1:action" content="tx" />
      <meta property="fc:frame:button:1:target" content="${BASE_URL}/tx" />
      <meta property="fc:frame:button:1:post_url" content="${BASE_URL}/frame" />

      <style>
        body {
          font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          background: #111; color: #fff; text-align: center; padding: 3rem;
        }
        h1 { font-size: 22px; margin: 0 0 10px; }
        p { opacity: .8; }
      </style>
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
