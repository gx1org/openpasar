import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { database_url } from './config.js'

const sql = neon(database_url)
export const db = drizzle(sql)
