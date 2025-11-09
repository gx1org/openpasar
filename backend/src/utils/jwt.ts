import { sign } from 'hono/jwt'
import { getEnv } from '../env.js';

export const generateJwt = async (id: string, email: string): Promise<string> => {
    const jwt_secret = getEnv('JWT_SECRET', 'default_secret');
    const token = await sign({
        id: id,           // ID user (optional, bisa ganti dengan data lain)
        email: email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // expired 7 hari
    },
    jwt_secret
    )
    return token
}
