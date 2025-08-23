// frame-server/index.ts

import express from "express";
import cors from "cors";

import frameRouter from "./routes/frame";
import txRouter from "./routes/tx";
import frameImageRouter from "./routes/frame-image";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/frame", frameRouter);
app.use("/tx", txRouter);
app.use("/frame-image", frameImageRouter);

// Start server
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Frame server is running on http://0.0.0.0:${PORT}`);
});
