import { Router } from 'express';

const router = Router();
const baseUrl = 'https://frame.finalclick.xyz';
const CONTRACT_ADDRESS = '0x1500B17b40A16E05F4f048dED59Eb249f73C400B'; // کانترکت واقعی تو
const CHAIN_ID = '8453'; // برای Base mainnet

router.get('/frame', async (_req, res) => {
  const html = `
    <html>
      <head>
        <meta property="og:title" content="🔔 Final Click — Buzz to Win!" />
        <meta property="og:description" content="Buzz for 0.00005 ETH. Last click wins the pot!" />
        <meta property="og:image" content="${baseUrl}/frame/image?ts=${Date.now()}" />
        <meta property="og:url" content="${baseUrl}/frame" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/frame/image?ts=${Date.now()}" />
        
        <meta property="fc:frame:button:1" content="Buzz 🔔" />
        <meta property="fc:frame:button:1:action" content="tx" />
        <meta property="fc:frame:button:1:target" content="eip155:${CHAIN_ID}:${CONTRACT_ADDRESS}" />
        <meta property="fc:frame:button:1:chain" content="eip155:${CHAIN_ID}" />
        <meta property="fc:frame:button:1:gas" content="100000" />
        <meta property="fc:frame:button:1:value" content="50000000000000" /> <!-- 0.00005 ETH -->
        <meta property="fc:frame:button:1:abi" content='[{"type":"function","name":"click","inputs":[]}]' />

        <meta property="fc:frame:post_url" content="${baseUrl}/frame/handle" />
      </head>
    </html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

router.post('/frame/handle', async (_req, res) => {
  const html = `
    <html>
      <head>
        <meta property="og:title" content="✅ Buzzed!" />
        <meta property="og:description" content="You clicked the buzzer. Stay sharp!" />
        <meta property="og:image" content="${baseUrl}/images/success.png?ts=${Date.now()}" />
        <meta property="og:url" content="${baseUrl}/frame" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/images/success.png?ts=${Date.now()}" />
        <meta property="fc:frame:button:1" content="Back 🔙" />
        <meta property="fc:frame:post_url" content="${baseUrl}/frame" />
      </head>
    </html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

export default router;
