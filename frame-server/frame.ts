import { Router } from 'express';

const router = Router();
const baseUrl = 'https://frame.finalclick.xyz';

router.get('/frame', async (_req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="🔔 Final Click — Buzz to Win!" />
        <meta property="og:description" content="Buzz for 0.00005 ETH. Last click wins the pot!" />
        <meta property="og:image" content="${baseUrl}/frame/image" />
        <meta property="og:url" content="${baseUrl}/frame" />

        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/frame/image" />
        <meta property="fc:frame:button:1" content="Buzz 🔔" />
        <meta property="fc:frame:button:1:action" content="tx" />
        <meta property="fc:frame:button:1:post_url" content="${baseUrl}/frame/handle" />
      </head>
      <body>
        <p>If you opened in browser, waiting for click...</p>
      </body>
    </html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

router.post('/frame/handle', async (_req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="✅ Buzzed!" />
        <meta property="og:description" content="You clicked the buzzer. Stay sharp!" />
        <meta property="og:image" content="${baseUrl}/frame/image" />
        <meta property="og:url" content="${baseUrl}/frame" />

        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/frame/image" />
        <meta property="fc:frame:button:1" content="Back" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:button:1:post_url" content="${baseUrl}/frame" />
      </head>
      <body>
        <p>Clicked! Waiting...</p>
      </body>
    </html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

export default router;
