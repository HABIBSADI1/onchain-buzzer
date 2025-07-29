import { Router } from 'express';
import { createCanvas } from 'canvas';
import { createPublicClient, getContract, http } from 'viem';
import { base } from 'viem/chains';

const router = Router();

// تنظیمات کانترکت
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

// 🖼 روت تصویر لایو
router.get('/images/frame.png', async (_req, res) => {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // پس‌زمینه
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  try {
    const [, , , timeRemaining, clicks] = await contract.read.getGameState();

    const seconds = Number(timeRemaining);
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    const formatted = `${min}:${sec.toString().padStart(2, '0')}`;

    // تایمر
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px sans-serif';
    ctx.fillText(`⏳ ${formatted}`, 450, 250);

    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(`🔁 Clicks: ${clicks}`, 470, 350);
  } catch (err) {
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 50px sans-serif';
    ctx.fillText('❌ Error fetching state', 300, 300);
  }

  const buffer = canvas.toBuffer('image/png');
  res.setHeader('Content-Type', 'image/png');
  res.send(buffer);
});

export default router;
