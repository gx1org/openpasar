import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { getEnv } from './env.js'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import fs from "fs";
import path from "path";

const database_url = getEnv('DATABASE_URL', '')
const sql = neon(database_url)
export const db = drizzle(sql)

export async function runMigration() {
  try {
    console.log('Running migrations...');
    const drizzlePath = scanCWD()
    await migrate(db, {
      migrationsFolder: drizzlePath
    });
    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

function scanCWD(): string {
  const files = fs.readdirSync(process.cwd());
  if (files.includes("drizzle")) {
    return path.join(process.cwd(), "drizzle");
  }

  if (files.includes('api')) {
    return path.join(process.cwd(), 'api', 'drizzle');
  }

  return path.join(process.cwd(), 'drizzle');
}