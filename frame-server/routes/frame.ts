import { Router } from "express";

/**
 * Frame router for Farcaster vNext frames.
 *
 * This route generates a minimal HTML document containing the
 * metadata required by Farcaster clients to display an interactive
 * frame.  To avoid content security policy issues, we do not embed
 * any tx details directly in the meta tags.  Instead we specify a
 * `post_url` that clients will call to retrieve the transaction
 * payload.  The preview image points at our frame‑image endpoint.
 */
const router = Router();

// Base URL for this frame server.  Prefer explicit environment
// variables when set, otherwise default to the frame subdomain.  Do
// not include a trailing slash.  This value is used to build
// absolute URLs for the preview image and post_url.
const baseUrl = process.env.FRAME_BASE_URL || process.env.BASE_URL || "https://frame.finalclick.xyz";

router.get("/", (_req, res) => {
  // Append a timestamp query parameter to bust caches on the image.  The
  // frame service caches images aggressively; a changing query param
  // ensures the client fetches a fresh image at least every refresh
  // period.
  const imageUrl = `${baseUrl}/frame-image/image?ts=${Date.now()}`;

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta property="og:title" content="Onchain Buzzer" />
    <meta property="og:description" content="Buzz the pot on Base — last click wins!" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imageUrl}" />
    <!--
      Define a single button.  We do not assign an explicit action
      (such as tx or link) here; instead all button presses will post
      to the fc:frame:post_url defined below.  The button text can be
      customised to guide the user.
    -->
    <meta property="fc:frame:button:1" content="🔥 BUZZ NOW" />
    <meta property="fc:frame:post_url" content="${baseUrl}/tx" />
    <!-- Optional: instruct clients to refresh the frame every 15 seconds
         so that the image stays up to date. -->
    <meta property="fc:frame:refresh_period" content="15" />
  </head>
  <body style="background:#000;color:#fff;font-family:system-ui,Arial,sans-serif;padding:2rem;text-align:center;">
    <h1>Onchain Buzzer</h1>
    <p>If you can read this, you're looking at a Farcaster frame page.</p>
  </body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  // Prevent caching of the HTML itself so that updates to metadata take
  // effect immediately.
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.send(html);
});

export default router;
