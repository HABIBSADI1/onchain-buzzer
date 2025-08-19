import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import frameRouter from "./routes/frame";
import txRouter from "./routes/tx";
import frameImageRouter from "./routes/frame-image";

const app = express();

// Load environment variables from .env at the root of the frame-server.  This
// ensures that CONTRACT_ADDRESS, RPC_URL and other variables defined in the
// provided `.env` file are available on process.env.  Without this call the
// variables would remain undefined in production builds.
dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/frame", frameRouter);
app.use("/tx", txRouter);
app.use("/frame-image", frameImageRouter);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
