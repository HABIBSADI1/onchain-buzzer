import { Router, type Request, type Response } from "express";

const router = Router();

function svg({ round, last, pot, clicks, time }: Record<string, string | number>) {
  const w = 1200;
  const h = 630;
  const lines = [
    `Round: ${round}`,
    `Last player: ${last}`,
    `Pot: ${pot} ETH`,
    `Clicks: ${clicks}`,
    `Time: ${time}`
  ];

  const lineHeight = 64;
  const startY = 160;

  const textEls = lines.map((txt, i) => {
    const y = startY + i * lineHeight;
    return `<text x="120" y="${y}" font-size="48" font-family="monospace" fill="#fff">${escapeXml(String(txt))}</text>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="#000"/>
  ${textEls}
  <rect x="100" y="${startY + lines.length * lineHeight + 40}" rx="14" ry="14" width="${w-200}" height="74" fill="#2a2235" stroke="#5a3d7a"/>
  <text x="${w/2}" y="${startY + lines.length * lineHeight + 90}" text-anchor="middle" font-size="32" font-family="monospace" fill="#cdb4ff">🔥 BUZZ NOW</text>
</svg>`;
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

router.get("/svg", (req: Request, res: Response) => {
  const { round = "?", last = "-", pot = "0", clicks = "0", time = "0:00" } = req.query as Record<string, string>;
  const svgXml = svg({ round, last, pot, clicks, time });
  res.set("Content-Type", "image/svg+xml; charset=utf-8");
  res.set("Cache-Control", "no-store");
  res.status(200).send(svgXml);
});

export default router;
