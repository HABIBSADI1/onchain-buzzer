import { Router, type Request, type Response } from "express";
import sharp from "sharp";

const router = Router();

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildSVG(q: Record<string, string>): string {
  const w = 1200, h = 628;
  const { round = "?", last = "-", pot = "0", clicks = "0", time = "0:00" } = q;

  const lines = [
    `Round: ${round}`,
    `Last player: ${last}`,
    `Pot: ${pot} ETH`,
    `Clicks: ${clicks}`,
    `Time: ${time}`
  ];

  const lineHeight = 64;
  const startY = 160;

  const textEls = lines.map((txt, i) =>
    `<text x="80" y="${startY + i * lineHeight}" font-size="48" font-family="monospace" fill="#fff">${escapeXml(txt)}</text>`
  ).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0b0b0f"/>
        <stop offset="1" stop-color="#141623"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect x="40" y="40" width="${w-80}" height="${h-80}" rx="24" fill="#11131a" stroke="#2b2f3a" stroke-width="4"/>
    ${textEls}
    <rect x="80" y="${startY + lines.length * lineHeight + 40}" rx="14" ry="14" width="${w-160}" height="76" fill="#2a2235" stroke="#5a3d7a" />
    <text x="${w/2}" y="${startY + lines.length * lineHeight + 92}" text-anchor="middle" font-size="32" font-family="monospace" fill="#cdb4ff">🔥 BUZZ NOW</text>
  </svg>`;
}

function setImageHeaders(res: Response) {
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Access-Control-Allow-Origin", "*");
}

router.head("/png", (_req, res) => {
  setImageHeaders(res);
  res.status(200).end();
});

router.get("/png", async (req: Request, res: Response) => {
  try {
    const svg = buildSVG(req.query as Record<string, string>);
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    setImageHeaders(res);
    return res.status(200).send(png);
  } catch (err) {
    console.error("frame-image/png error:", err);
    return res.status(500).send("image-error");
  }
});

export default router;
