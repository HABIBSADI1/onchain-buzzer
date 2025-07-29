// frame-image.ts
import { Router } from 'express';
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
  try {
    const [, , , timeRemaining] = await contract.read.getGameState();

    const minutes = Math.floor(Number(timeRemaining) / 60);
    const seconds = Number(timeRemaining) % 60;
    const timerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const svg = `
      <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
        <style>
          text {
            font-family: Arial, sans-serif;
            font-size: 48px;
            fill: #000;
          }
        </style>
        <rect width="100%" height="100%" fill="#fff"/>
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">
          ⏱️ ${timerText}
        </text>
      </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (err) {
    res.status(500).send('Error fetching timer');
  }
});

export default router;
