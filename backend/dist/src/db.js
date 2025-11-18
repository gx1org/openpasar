import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { getEnv } from './env.js';
const database_url = getEnv('DATABASE_URL', '');
const sql = neon(database_url);
export const db = drizzle(sql);
