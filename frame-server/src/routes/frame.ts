import { Router, type Request, type Response } from "express";

type GameState = {
  round: number;
  lastPlayer: string;
  potEth: number;
  clicks: number;
  time: string; // "0:00"
};

// ساده و درون‌حافظه‌ای (برای تست)
let state: GameState = {
  round: 22,
  lastPlayer: "0x63d3...01Ac",
  potEth: 0.00005,
  clicks: 1,
  time: "0:00"
};

const router = Router();

function absoluteBaseUrl(req: Request): string {
  if (process.env.PUBLIC_BASE_URL) return process.env.PUBLIC_BASE_URL;
  // با trust proxy درست کار می‌کند
  const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol;
  const host = req.get("host");
  return `${proto}://${host}`;
}

function frameHtml(req: Request, s: GameState): string {
  const base = absoluteBaseUrl(req);

  const imageUrl =
    `${base}/frame-image/png?` +
    `round=${encodeURIComponent(String(s.round))}` +
    `&last=${encodeURIComponent(s.lastPlayer)}` +
    `&pot=${encodeURIComponent(String(s.potEth))}` +
    `&clicks=${encodeURIComponent(String(s.clicks))}` +
    `&time=${encodeURIComponent(String(s.time))}`;

  const postUrl = `${base}/tx/action`;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta property="og:title" content="Farcaster Mini App"/>
  <meta property="og:description" content="Buzz game on Base"/>
  <meta property="og:image" content="${imageUrl}"/>
  <meta name="twitter:card" content="summary_large_image"/>

  <meta property="fc:frame" content="vNext"/>
  <meta property="fc:frame:image" content="${imageUrl}"/>
  <meta property="fc:frame:post_url" content="${postUrl}"/>
  <meta property="fc:frame:button:1" content="🔥 BUZZ NOW"/>
</head>
<body></body>
</html>`;
}

// GET: صفحه‌ی اولیه فریم
router.get("/", (req: Request, res: Response) => {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.set("Cache-Control", "no-store, max-age=0");
  res.status(200).send(frameHtml(req, state));
});

export default router;
