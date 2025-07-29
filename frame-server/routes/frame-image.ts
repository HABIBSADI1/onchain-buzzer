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
    const [roundId, lastPlayer, pot, timeRemaining, clicks] = await contract.read.getGameState();

    const sec = Number(timeRemaining);
    const mm = Math.floor(sec / 60);
    const ss = sec % 60;
    const timerText = `${mm}:${ss.toString().padStart(2, '0')}`;

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 60px sans-serif';
    ctx.fillText(`⏱ Time: ${timerText}`, 50, 120);
    ctx.fillText(`🔢 Round: ${roundId}`, 50, 220);
    ctx.fillText(`👤 Last: ${lastPlayer.slice(0, 10)}...`, 50, 320);
    ctx.fillText(`💰 Pot: ${(Number(pot) / 1e18).toFixed(5)} ETH`, 50, 420);
    ctx.fillText(`🖱 Clicks: ${clicks}`, 50, 520);
  } catch (err) {
    ctx.fillStyle = '#f00';
    ctx.font = 'bold 50px sans-serif';
    ctx.fillText('❌ Error fetching state', 100, 300);
  }

  const png = canvas.toBuffer('image/png');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=15'); // refresh every 15 seconds
  res.send(png);
});

export default router;
