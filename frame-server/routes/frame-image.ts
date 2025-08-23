import { Router } from "express";
import { createCanvas, registerFont } from "canvas";
import { createPublicClient, getContract, http } from "viem";
import { base } from "viem/chains";
import { abi } from "./abi";
import path from "path";

const router = Router();

const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as `0x${string}`;
const RPC_URL = process.env.VITE_RPC_URL!;

// Pre‑load fonts ahead of time.  Use a font with broad Unicode coverage so
// that Persian/Arabic characters render properly in the preview image.  The
// container comes with the NotoSans family installed under
// `/usr/share/fonts/truetype/noto`.  Attempt to register that font first
// because it supports many scripts including Arabic/Persian.  If the file
// doesn’t exist for some reason, fall back to the bundled DejaVuSans font.
try {
  registerFont(
    path.join(
      "/usr/share/fonts/truetype/noto",
      "NotoSans-Regular.ttf"
    ),
    {
      family: "NotoSans",
    }
  );
} catch (e) {
  // On failure, fallback to the bundled DejaVuSans font so text still
  // renders correctly.  Do not crash on missing fonts.  eslint-disable-next-line
  registerFont(path.join(process.cwd(), "public/fonts/DejaVuSans.ttf"), {
    family: "NotoSans",
  });
}

// Note: older frames used DejaVuSans as the family name.  When drawing text
// below we reference the family name `NotoSans`.  If fallback kicks in
// registerFont above will alias DejaVuSans into the same family name.  This
// avoids having to branch on the chosen font family later in the code.

const publicClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
});

const contract = getContract({
  address: CONTRACT_ADDRESS,
  abi,
  client: publicClient,
});

router.get("/image", async (_req, res) => {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 1200, 630);

  try {
    const [roundId, lastPlayer, pot, timeRemaining, clicks] =
      (await contract.read.getGameState()) as [
        bigint,
        string,
        bigint,
        bigint,
        bigint
      ];

    const sec = Number(timeRemaining);
    const mm = Math.floor(sec / 60);
    const ss = sec % 60;
    const timerText = `${mm}:${ss.toString().padStart(2, "0")}`;

    // Use the NotoSans font family registered above.  Bold style gives
    // better contrast against the dark background.  The font size is kept
    // large for readability on mobile devices.
    ctx.fillStyle = "#fff";
    ctx.font = "bold 48px NotoSans";
    // Round and last player information
    ctx.fillText(`Round: ${roundId}`, 60, 120);
    const shortened = `${lastPlayer.slice(0, 6)}...${lastPlayer.slice(-4)}`;
    ctx.fillText(`Last player: ${shortened}`, 60, 200);
    // Convert the pot from wei to ETH and display up to 5 decimal places
    ctx.fillText(
      `Pot: ${(Number(pot) / 1e18).toFixed(5)} ETH`,
      60,
      280
    );
    ctx.fillText(`Clicks: ${clicks}`, 60, 360);
    ctx.fillText(`Time: ${timerText}`, 60, 440);
  } catch (err) {
    // If there is an error reading the game state, display a message in red.
    ctx.fillStyle = "#f00";
    ctx.font = "bold 48px NotoSans";
    ctx.fillText("Error loading state", 100, 300);
  }

  const png = canvas.toBuffer("image/png");
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=15");
  res.send(png);
});

export default router;
