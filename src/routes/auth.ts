import rateLimit from 'express-rate-limit';
import { Router, type Request, type Response } from 'express';
import { clearTokenCookie, setTokenCookie } from '../lib/cookies.js';
import { createUser } from '../services/user.js';

const router = Router();
const registerLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).render('register', {
      token: undefined,
      error: 'Too many tokens generated from this IP. Try again in 10 minutes.',
    });
  },
});

router.get('/register', (_req: Request, res: Response) => {
  res.render('register', { token: undefined, error: undefined });
});

router.post('/register', registerLimiter, async (_req: Request, res: Response) => {
  const user = await createUser();
  setTokenCookie(res, user.apiToken);
  res.render('register', { token: user.apiToken, error: undefined });
});

router.post('/logout', (_req: Request, res: Response) => {
  clearTokenCookie(res);
  res.redirect('/');
});

export default router;
