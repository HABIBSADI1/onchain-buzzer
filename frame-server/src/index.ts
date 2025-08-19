import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import frameRoute from "./routes/frame";
import frameImageRoute from "./routes/frame-image";
import txRoute from "./routes/tx";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get("/", (_req, res) => res.send("frame server OK"));

// Routes
app.use("/frame", frameRoute);
app.use("/frame-image", frameImageRoute);
app.use("/tx", txRoute); // فقط برای تست؛ در meta-tx استفاده نمی‌شود

// No-store globally (اینجوری کش مشکل‌ساز نمی‌شود)
app.use((_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frame server running on http://0.0.0.0:${PORT}`);
});
