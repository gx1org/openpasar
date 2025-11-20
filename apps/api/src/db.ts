import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { getEnv } from './env.js'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import fs from "fs";
import path from "path";

const databaseUrl = getEnv('DATABASE_URL')
const sanitizedUrl = databaseUrl.replace("psql '", "").replace("'", "")
const sql = neon(sanitizedUrl)
export const db = drizzle(sql)

export async function runMigration(): Promise<boolean> {
  try {
    console.log('Running migrations...');
    const drizzlePath = scanCWD()
    await migrate(db, {
      migrationsFolder: drizzlePath
    });
    console.log('Migrations completed successfully.');
    return true
  } catch (error) {
    console.error('Migration failed:', error);
    return false
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

  if (files.includes('apps')) {
    return path.join(process.cwd(), 'apps', 'api', 'drizzle');
  }

  console.log('Files:', files);  
  return path.join(process.cwd(), 'drizzle');
}