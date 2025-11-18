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
    scanCWD()
    await migrate(db, {
      migrationsFolder: process.cwd() + "/drizzle"
    });
    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

function scanCWD() {
  console.log("CWD:", process.cwd());

  const files = fs.readdirSync(process.cwd());
  console.log("Files in CWD:", files);
}