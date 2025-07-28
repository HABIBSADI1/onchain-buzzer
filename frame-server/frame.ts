import { Router } from 'express';
import { ethers } from 'ethers';
import { abi } from './abi.js';

const CONTRACT = process.env.CONTRACT_ADDRESS!;
const RPC_URL = process.env.RPC_URL!;
const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT, abi, provider);

const router = Router();

router.get('/frame', async (_req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <html>
      <head>
        <meta property="og:title" content="🔔 Final Click — Buzz to Win!" />
        <meta property="og:description" content="Buzz for 0.00005 ETH. Last click wins the pot!" />
        <meta property="og:image" content="frame-farcaster-production.up.railway.app/images/active.png" />
        <meta property="og:url" content="https://frame-farcaster-production.up.railway.app/frame" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="frame-farcaster-production.up.railway.app/images/active.png?ts=${Date.now()}" />
        <meta property="fc:frame:button:1" content="Buzz 🔔" />
        <meta property="fc:frame:post_url" content="frame-farcaster-production.up.railway.app/frame/handle" />
      </head>
    </html>
  `);
});

router.post('/frame/handle', async (_req, res) => {
  try {
    const [roundId, , pot, timeRemaining] = await contract.getGameState();
    const secondsLeft = Number(timeRemaining);
    const imageUrl = secondsLeft === 0
      ? `https://finalclick.xyz/images/winner.png?ts=${Date.now()}`
      : `https://finalclick.xyz/images/active.png?ts=${Date.now()}`;

    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
          <meta property="fc:frame:button:1" content="Buzz 🔔" />
          <meta property="fc:frame:post_url" content="https://frame.finalclick.xyz/frame/handle" />
        </head>
      </html>
    `);
  } catch (e) {
    res.status(500).send('Error rendering frame');
  }
});

export default router;
