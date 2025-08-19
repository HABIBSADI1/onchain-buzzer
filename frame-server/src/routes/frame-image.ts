import { Router } from "express";
import { createPublicClient, http, formatEther } from "viem";
import { base } from "viem/chains";
import { abi } from "./abi";

const router = Router();

const CONTRACT_ADDRESS =
  (process.env.VITE_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS) as `0x${string}`;
const RPC_URL = process.env.VITE_RPC_URL || process.env.RPC_URL;
const IMAGE_FORMAT = (process.env.FRAME_IMAGE_FORMAT || "svg").toLowerCase() as "png" | "svg";

const client = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
});

type GameState = {
  round: number;
  last: string;
  pot: string;     // ETH string
  clicks: number;
  time: string;    // M:SS
};

async function readState(): Promise<GameState> {
  let round = 0, last = "0x0000…0000", pot = "0.00000", clicks = 0, time = "0:00";
  try {
    const [roundId, lastPlayer, potWei, timeRemaining, clicksCount] =
      (await client.readContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "getGameState",
        args: [],
      })) as any;

    round = Number(roundId);
    last = String(lastPlayer).slice(0, 6) + "…" + String(lastPlayer).slice(-4);
    pot = Number(formatEther(potWei)).toFixed(5);
    clicks = Number(clicksCount);
    const tr = Number(timeRemaining);
    const m = Math.floor(tr / 60), s = tr % 60;
    time = `${m}:${String(s).padStart(2, "0")}`;
  } catch {
    // ignore – با دیفالت‌ها ادامه بده
  }
  return { round, last, pot, clicks, time };
}

function renderSvg(s: GameState): string {
  return `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .bg{fill:#000}
      .t1{fill:#fff;font:bold 52px system-ui, -apple-system, Segoe UI, Roboto, sans-serif}
      .t2{fill:#fff;font:36px system-ui, -apple-system, Segoe UI, Roboto, sans-serif}
    </style>
  </defs>
  <rect class="bg" x="0" y="0" width="1200" height="630"/>
  <text class="t1" x="60" y="120">Round: ${s.round}</text>
  <text class="t2" x="60" y="190">Last player: ${s.last}</text>
  <text class="t2" x="60" y="250">Pot: ${s.pot} ETH</text>
  <text class="t2" x="60" y="310">Clicks: ${s.clicks}</text>
  <text class="t2" x="60" y="370">Time: ${s.time}</text>
</svg>`.trim();
}

async function renderPng(s: GameState): Promise<Buffer> {
  // داینامیک لود؛ اگر نصب نباشه خطا می‌گیریم و fallback می‌زنیم
  let mod: any;
  try {
    mod = await import("canvas");
  } catch {
    throw new Error("canvas-not-available");
  }

  const { createCanvas } = mod;
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 1200, 630);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 52px sans-serif";
  ctx.fillText(`Round: ${s.round}`, 60, 120);
  ctx.font = "36px sans-serif";
  ctx.fillText(`Last player: ${s.last}`, 60, 190);
  ctx.fillText(`Pot: ${s.pot} ETH`, 60, 250);
  ctx.fillText(`Clicks: ${s.clicks}`, 60, 310);
  ctx.fillText(`Time: ${s.time}`, 60, 370);

  return canvas.toBuffer("image/png");
}

router.get("/image", async (_req, res) => {
  const state = await readState();

  if (IMAGE_FORMAT === "png") {
    try {
      const buf = await renderPng(state);
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "no-store");
      return res.send(buf);
    } catch {
      // canvas موجود نیست → SVG
    }
  }

  const svg = renderSvg(state);
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "no-store");
  res.send(svg);
});

export default router;
