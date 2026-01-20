import { Router, type Request, type Response } from 'express';
import { clearTokenCookie, getTokenFromRequest, setTokenCookie } from '../lib/cookies.js';
import { getUserByToken } from '../services/user.js';
import { getUserStats } from '../services/coffee-break.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const token = getTokenFromRequest(req);
  if (token) {
    const user = await getUserByToken(token);
    if (user) {
      const stats = await getUserStats(user.id);
      res.render('stats', { stats, token });
      return;
    }
    clearTokenCookie(res);
  }

  res.render('login-token', { error: undefined, token: token ?? '' });
});

router.post('/', async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token || typeof token !== 'string') {
    res.render('login-token', { error: 'Please enter a token', token: '' });
    return;
  }

  const trimmedToken = token.trim();
  const user = await getUserByToken(trimmedToken);
  if (!user) {
    res.render('login-token', { error: 'Invalid token', token: trimmedToken });
    return;
  }

  setTokenCookie(res, trimmedToken);
  const stats = await getUserStats(user.id);
  res.render('stats', { stats, token: trimmedToken });
});

export default router;
