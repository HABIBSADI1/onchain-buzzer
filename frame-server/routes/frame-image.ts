import { Router } from "express";
import { createPublicClient, http, formatEther } from "viem";
import { base } from "viem/chains";
import { abi } from "./abi";

const router = Router();

const CONTRACT_ADDRESS =
  (process.env.VITE_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS) as `0x${string}`;
const RPC_URL = process.env.VITE_RPC_URL || process.env.RPC_URL;

const client = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
});

router.get("/image", async (_req, res) => {
  // دیفالت‌ها
  let round = 0, last = "0x0000…0000", pot = "0.00000", clicks = 0, time = "0:00";

  try {
    // انتظار داریم تابع getGameState وجود داشته باشد
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
    // اگر خواندن شکست خورد، همان دیفالت‌ها را نشان می‌دهیم
  }

  // خروجی SVG (بدون وابستگی به canvas)
  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .bg{fill:#000}
      .t1{fill:#fff;font:bold 52px system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
      .t2{fill:#fff;font:36px system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
    </style>
  </defs>
  <rect class="bg" x="0" y="0" width="1200" height="630"/>
  <text class="t1" x="60" y="120">Round: ${round}</text>
  <text class="t2" x="60" y="190">Last player: ${last}</text>
  <text class="t2" x="60" y="250">Pot: ${pot} ETH</text>
  <text class="t2" x="60" y="310">Clicks: ${clicks}</text>
  <text class="t2" x="60" y="370">Time: ${time}</text>
</svg>`.trim();

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "no-store");
  res.send(svg);
});

export default router;
