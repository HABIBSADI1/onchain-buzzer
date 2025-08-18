import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import frameRouter from "./routes/frame.js";
import frameImageRouter from "./routes/frame-image.js";
import actionRouter from "./routes/tx.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// حتماً پشت پراکسی Railway:
app.set("trust proxy", true);

// CORS (در عمل برای Frames لازم نیست، ولی نگه می‌داریم)
app.use(cors({
  origin: (_origin, cb) => cb(null, true),
  methods: ["GET", "POST", "HEAD", "OPTIONS"],
  allowedHeaders: ["content-type", "x-requested-with"]
}));

app.use(express.json());

// استاتیک برای .well-known و ...
app.use("/",
  express.static(path.join(__dirname, "..", "public"), {
    dotfiles: "allow",
    index: false,
    setHeaders: (res, file) => {
      if (file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".webp")) {
        res.setHeader("Cache-Control", "no-store, max-age=0");
      }
    }
  })
);

// روت‌های فریم
app.use("/frame", frameRouter);
app.use("/frame-image", frameImageRouter);
app.use("/tx", actionRouter);

// health
app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

const PORT = Number(process.env.PORT) || 8080;
const BASE = process.env.PUBLIC_BASE_URL || `http://0.0.0.0:${PORT}`;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${BASE}`);
});
