import express from "express";
import cors from "cors";
import frameRouter from "./routes/frame";
import txRouter from "./routes/tx";
import frameImageRouter from "./routes/frame-image";

const app = express();
app.use(cors({
  origin: [
    'https://frame.finalclick.xyz',
    'https://your.farcaster.domain',  // اگر دامنه خاصی برای Farcaster داری اینجا اضافه کن
    'https://farcaster.xyz',          // فرضی برای مثال
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use("/frame", frameRouter);
app.use("/tx", txRouter);
app.use("/frame-image", frameImageRouter);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
