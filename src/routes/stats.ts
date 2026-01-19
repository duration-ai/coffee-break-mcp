import { Router, type Request, type Response } from "express";
import { getUserByToken } from "../services/user.js";
import { getUserStats } from "../services/coffee-break.js";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.render("login-token", { error: null });
});

router.post("/", async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token || typeof token !== "string") {
    res.render("login-token", { error: "Please enter a token" });
    return;
  }

  const user = await getUserByToken(token.trim());
  if (!user) {
    res.render("login-token", { error: "Invalid token" });
    return;
  }

  const stats = await getUserStats(user.id);
  res.render("stats", { stats, token: token.trim() });
});

export default router;
