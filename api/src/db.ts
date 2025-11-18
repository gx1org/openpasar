import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { getEnv } from './env.js'
import { migrate } from 'drizzle-orm/neon-http/migrator'

const database_url = getEnv('DATABASE_URL', '')
const sql = neon(database_url)
export const db = drizzle(sql)

export async function runMigration() {
  try {
    console.log('Running migrations...');
    await migrate(db, {
      migrationsFolder: process.cwd() + "/drizzle"
    });
    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}
