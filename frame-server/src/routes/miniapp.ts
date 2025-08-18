import { Router, type Request, type Response } from "express";

const router = Router();

// Minimal Mini App manifest (experimental).
// Warpcast will try to read this to show the app in the composer / Mini Apps grid.
router.get("/manifest.json", (req: Request, res: Response) => {
  const base = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
  res.set("Cache-Control", "no-store");
  res.json({
    version: "1",
    app: {
      id: "finalclick",
      name: "Farcaster Mini App",
      icon_url: `${base}/icon.png`,
      home_url: `${base}/frame`
    },
    actions: [
      {
        id: "buzz",
        name: "Buzz Now",
        description: "Tap to buzz and refresh the frame",
        action_url: `${base}/miniapp/actions/buzz`
      }
    ]
  });
});

// List endpoint (some clients expect /miniapp/actions)
router.get("/actions", (req: Request, res: Response) => {
  const base = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
  res.json({
    actions: [
      {
        id: "buzz",
        name: "Buzz Now",
        description: "Tap to buzz and refresh the frame",
        action_url: `${base}/miniapp/actions/buzz`
      }
    ]
  });
});

// Handle the "buzz" action. Respond with a Frame redirect.
router.post("/actions/buzz", (req: Request, res: Response) => {
  const base = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
  res.json({
    type: "frame_redirect",
    frame_url: `${base}/frame`
  });
});

// Preflight for POST
router.options("/actions/buzz", (_: Request, res: Response) => {
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "content-type");
  res.status(204).end();
});

export default router;
