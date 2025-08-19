import { Router } from "express";
const router = Router();

router.post("/", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ ok: true, mode: "meta-tx-only" });
});

export default router;
