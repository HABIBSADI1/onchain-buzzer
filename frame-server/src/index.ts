import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import frameRouter from "./routes/frame.js";
import frameImageRouter from "./routes/frame-image.js";
import miniAppRouter from "./routes/miniapp.js";

// __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS: allow wallet.farcaster.xyz and clients to POST to actions
const CORS_ALLOWLIST = (process.env.CORS_ALLOWLIST || "https://wallet.farcaster.xyz,https://farcaster.xyz,https://client.farcaster.xyz,https://warpcast.com,https://client.warpcast.com")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (CORS_ALLOWLIST.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["content-type", "x-requested-with"]
}));

app.use(express.json());

// Serve static files (including .well-known/farcaster.json).
// Using absolute path relative to project.
app.use("/",
  express.static(path.join(__dirname, "..", "public"), {
    dotfiles: "allow",
    maxAge: "1h",
    index: false,
  })
);

// Routers
app.use("/frame", frameRouter);
app.use("/frame-image", frameImageRouter);
app.use("/miniapp", miniAppRouter);

// Health
app.get("/health", (_, res) => res.status(200).json({ ok: true }));

const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, "0.0.0.0", () => {
  const base = process.env.PUBLIC_BASE_URL || `http://0.0.0.0:${PORT}`;
  console.log(`Server running on ${base}`);
});
