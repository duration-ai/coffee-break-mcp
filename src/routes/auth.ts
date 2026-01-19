import { Router, type Request, type Response } from "express";
import { createUser } from "../services/user.js";

const router = Router();

router.get("/register", (_req: Request, res: Response) => {
  res.render("register", { token: null });
});

router.post("/register", async (_req: Request, res: Response) => {
  const user = await createUser();
  res.render("register", { token: user.apiToken });
});

export default router;
