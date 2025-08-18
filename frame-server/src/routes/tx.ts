import { Router } from "express";

const router = Router();

// Farcaster POST to this endpoint after button press
router.post("/action", (req, res) => {
  // می‌تونی req.body را لاگ کنی یا امضا/اعتبارسنجی انجام بدی
  // فعلاً برای تست یک پاسخ ساده برمی‌گردانیم.
  // پاسخ HTML بازگشتی هم مجاز است؛ اما JSON سبک‌تر است.
  return res.status(200).json({ ok: true });
});

export default router;
