import type { Request, Response } from 'express';

export const TOKEN_COOKIE_NAME = 'coffee_break_token';
const TOKEN_COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 365;

export function getTokenFromRequest(req: Request): string | undefined {
  const token = req.cookies?.[TOKEN_COOKIE_NAME];
  if (typeof token === 'string' && token.trim().length > 0) {
    return token;
  }
  return undefined;
}

export function setTokenCookie(res: Response, token: string): void {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: TOKEN_COOKIE_MAX_AGE_MS,
    path: '/',
  });
}

export function clearTokenCookie(res: Response): void {
  res.clearCookie(TOKEN_COOKIE_NAME, { path: '/' });
}
