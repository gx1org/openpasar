import { sign } from 'hono/jwt'
import type { Context } from 'hono';
import { getEnv } from '../env.js';

export type JwtPayload = {
  id: string;
  email: string;
  store_id: string;
  exp?: number;
}

export const generateJwt = async (id: string, email: string, store_id: string): Promise<string> => {
  const jwt_secret = getEnv('JWT_SECRET', 'default_secret');
  const token = await sign({
      id,
      email,
      store_id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // expired 7 days
  },
  jwt_secret
  )
  return token
}

export const getJwtPayload = (c: Context): JwtPayload => c.get('jwtPayload') as JwtPayload;
