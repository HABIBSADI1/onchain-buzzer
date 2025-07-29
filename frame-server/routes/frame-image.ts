import { Router } from 'express';
import { createCanvas } from 'canvas';
import { createPublicClient, getContract, http } from 'viem';
import { base } from 'viem/chains';
import abi from './abi.json';

const router = Router();

const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as `0x${string}`;
const RPC_URL = process.env.VITE_RPC_URL!;

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
      (await contract.read.getGameState()) as [bigint, string, bigint, bigint, bigint];

    console.log('✅ Game state:', [roundId, lastPlayer, pot, timeRemaining, clicks]);

    const sec = Number(timeRemaining);
    const mm = Math.floor(sec / 60);
    const ss = sec % 60;
    const timerText = `${mm}:${ss.toString().padStart(2, '0')}`;
    const eth = Number(pot) / 1e18;

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 50px "Arial", sans-serif';
    ctx.fillText(`🕹️ Round: ${roundId.toString()}`, 60, 100);
    ctx.fillText(`🧠 Last Player: ${lastPlayer.slice(0, 6)}...${lastPlayer.slice(-4)}`, 60, 180);
    ctx.fillText(`🪙 Pot: ${eth.toFixed(5)} ETH`, 60, 260);
    ctx.fillText(`💥 Clicks: ${clicks.toString()}`, 60, 340);
    ctx.fillText(`⏱️ Timer: ${timerText}`, 60, 420);

  } catch (err) {
    ctx.fillStyle = '#f00';
    ctx.font = 'bold 40px "Arial", sans-serif';
    ctx.fillText('Error loading state', 100, 300);
    console.error(err);
  }

  const png = canvas.toBuffer('image/png');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=15');
  res.send(png);
});

export default router;
