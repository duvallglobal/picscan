import jwt from 'jsonwebtoken';
import { PixlrTokenPayload } from '../types/pixlr';

export function generatePixlrToken(payload: Omit<PixlrTokenPayload, 'sub'>): string {
  const apiKey = process.env.NEXT_PUBLIC_PIXLR_API_KEY;
  const apiSecret = process.env.PIXLR_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('Pixlr API credentials not configured');
  }

  const tokenPayload: PixlrTokenPayload = {
    sub: apiKey,
    ...payload
  };

  return jwt.sign(tokenPayload, apiSecret, { algorithm: 'HS256' });
}
