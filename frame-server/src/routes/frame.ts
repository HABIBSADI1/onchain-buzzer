import { Router, type Request, type Response } from "express";

type GameState = {
  round: number;
  lastPlayer: string;
  potEth: number;
  clicks: number;
  time: number;
};

// very simple in-memory state (replace with DB in production)
let state: GameState = {
  round: 22,
  lastPlayer: "0x63d3...01Ac",
  potEth: 0.00005,
  clicks: 1,
  time: 0
};

function htmlForFrame(req: Request, s: GameState): string {
  const base = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
  const img = `${base}/frame-image/svg?round=${encodeURIComponent(String(s.round))}`
    + `&last=${encodeURIComponent(s.lastPlayer)}`
    + `&pot=${encodeURIComponent(String(s.potEth))}`
    + `&clicks=${encodeURIComponent(String(s.clicks))}`
    + `&time=${encodeURIComponent(String(s.time))}`;

  const postUrl = `${base}/frame`;

  return `<!doctype html>
<html>
  <head>
    <meta property="og:title" content="Farcaster Mini App" />
    <meta property="og:image" content="${img}" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${img}" />
    <meta property="fc:frame:post_url" content="${postUrl}" />
    <meta property="fc:frame:button:1" content="🔥 BUZZ NOW" />
  </head>
  <body />
</html>`;
}

const router = Router();

// Initial frame
router.get("/", (req: Request, res: Response) => {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.set("Cache-Control", "no-store");
  res.status(200).send(htmlForFrame(req, state));
});

// Handle frame post (button press)
router.post("/", (req: Request, res: Response) => {
  // naive demo update
  state = {
    ...state,
    clicks: state.clicks + 1,
    time: 0,
  };
  res.set("Content-Type", "text/html; charset=utf-8");
  res.set("Cache-Control", "no-store");
  res.status(200).send(htmlForFrame(req, state));
});

export default router;
