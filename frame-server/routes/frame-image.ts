import { Router } from 'express';
import { createCanvas } from 'canvas';
import { createPublicClient, getContract, http } from 'viem';
import { base } from 'viem/chains';

const router = Router();

const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as `0x${string}`;
const RPC_URL = process.env.VITE_RPC_URL!;

const abi = [
  {
    type: 'function',
    name: 'getGameState',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: '_roundId', type: 'uint256' },
      { name: '_lastPlayer', type: 'address' },
      { name: '_pot', type: 'uint256' },
      { name: '_timeRemaining', type: 'uint256' },
      { name: '_clicks', type: 'uint256' },
    ],
  },
] as const;

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
    const [, , , timeRemaining, clicks] = await contract.read.getGameState();

    const sec = Number(timeRemaining);
    const mm = Math.floor(sec / 60);
    const ss = sec % 60;
    const timerText = `${mm}:${ss.toString().padStart(2, '0')}`;
    const pot = await contract.read.getGameState(); // یا اضافه‌کردن pot

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 80px sans-serif';
    ctx.fillText(`Round`, 50, 150);
    ctx.fillText(`${timerText}`, 50, 260);
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(`Clicks: ${clicks}`, 50, 360);

    // می‌تونی مقدار Pot یا roundId رو هم اون‌جا اضافه کنی
  } catch (err) {
    ctx.fillStyle = '#f00';
    ctx.font = 'bold 50px sans-serif';
    ctx.fillText('Error fetching state', 100, 300);
  }

  const png = canvas.toBuffer('image/png');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=15'); // بروزسانی تصویر هر ۱۵ ثانیه
  res.send(png);
});

export default router;
