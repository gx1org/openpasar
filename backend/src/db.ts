import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import dotenv from 'dotenv'

// Load .env kalau lokal
if (!process.env.VERCEL && !process.env.CF_PAGES) {
  dotenv.config()
}

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw new Error('DATABASE_URL is not defined')

const sql = neon(DATABASE_URL)
export const db = drizzle(sql)
