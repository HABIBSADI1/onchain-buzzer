import express from "express";
import cors from "cors";
import frameRouter from "./routes/frame";
import txRouter from "./routes/tx";
import frameImageRouter from "./routes/frame-image";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the public directory.  This includes fonts,
// images, and dot‑files such as .well-known/farcaster.json.  The
// `dotfiles: "allow"` option ensures that Express does not block
// dot-prefixed files by default.  Without this, the /.well-known
// endpoint would return a 404 or redirect to index.html when hosted on
// platforms that treat dotfiles specially.
app.use(
  "/",
  express.static(path.join(process.cwd(), "public"), {
    dotfiles: "allow",
  })
);

app.use("/frame", frameRouter);
app.use("/tx", txRouter);
app.use("/frame-image", frameImageRouter);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
