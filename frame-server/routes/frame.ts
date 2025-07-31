import { Router } from 'express';
import { encodeFunctionData } from 'viem';
import { abi } from '../abi'; // مطمئن شو فایل `abi.ts` درست export داره

const router = Router();

const baseUrl = 'https://frame.finalclick.xyz'; // ← آدرس Railway یا دامنه شما
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as `0x${string}`;
const CLICK_FEE = '0.00005';

// Encode the calldata for click() function
const encodedClickData = encodeFunctionData({
  abi,
  functionName: 'click',
  args: [],
});

router.get('/', async (_req, res) => {
  const imageUrl = `${baseUrl}/frame-image/image?ts=${Date.now()}`;

  const html = `
    <html>
      <head>
        <meta property="og:title" content="🔔 Final Click — Buzz to Win!" />
        <meta property="og:description" content="Buzz for 0.00005 ETH. Last click wins the pot!" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:url" content="${baseUrl}/frame" />

        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${imageUrl}" />

        <meta property="fc:frame:button:1" content="🔥 BUZZ NOW" />
        <meta property="fc:frame:button:1:action" content="tx" />
        <meta property="fc:frame:button:1:target" content="eip155:8453:${CONTRACT_ADDRESS}" />
        <meta property="fc:frame:button:1:data" content="${encodedClickData}" />
        <meta property="fc:frame:button:1:value" content="${CLICK_FEE}" />
      </head>
      <body></body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

export default router;
