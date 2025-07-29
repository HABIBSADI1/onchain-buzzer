import { Router } from 'express';
import { createCanvas, registerFont } from 'canvas';
import { createPublicClient, getContract, http } from 'viem';
import { base } from 'viem/chains';
import abi from './abi.json';
import path from 'path';

const router = Router();

const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as `0x${string}`;
const RPC_URL = process.env.VITE_RPC_URL!;

// ✅ اگر فونت خاصی داری، اینجا اضافه‌اش کن (مثلاً Roboto)
registerFont(path.join(process.cwd(), 'public/fonts/Roboto-Regular.ttf'), {
  family: 'Roboto',
});

const publicClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
});

const contract = getContract({
  address: CONTRACT_ADDRESS,
  abi,
  client: publicClient,
});

router.get('/frame/image', async (_req, res) => {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 1200, 630);

  try {
    const [roundId, lastPlayer, pot, timeRemaining, clicks] =
      (await contract.read.getGameState()) as unknown as [bigint, string, bigint, bigint, bigint];

    const sec = Number(timeRemaining);
    const mm = Math.floor(sec / 60);
    const ss = sec % 60;
    const timerText = `${mm}:${ss.toString().padStart(2, '0')}`;

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 52px Roboto, sans-serif';
    ctx.fillText(`🏁 Round: ${roundId}`, 60, 120);
    ctx.fillText(`👤 Last: ${lastPlayer.slice(0, 6)}...${lastPlayer.slice(-4)}`, 60, 200);
    ctx.fillText(`💰 Pot: ${(Number(pot) / 1e15).toFixed(2)} finney`, 60, 280);
    ctx.fillText(`🔢 Clicks: ${clicks}`, 60, 360);
    ctx.fillText(`⏱️ Time: ${timerText}`, 60, 440);
  } catch (err) {
    ctx.fillStyle = '#f00';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('Error loading state', 100, 300);
  }

  const png = canvas.toBuffer('image/png');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=15');
  res.send(png);
});

export default router;
