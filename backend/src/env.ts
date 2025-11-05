import dotenv from 'dotenv'

// Load .env hanya kalau dijalankan lokal
// if (!process.env.VERCEL && !process.env.CF_PAGES) {
//   dotenv.config()
// }

// Helper function agar lebih aman
export const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key]
  if (!value && fallback === undefined) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value ?? fallback as string
}

export const envCheck = () => {
  const requiredVars = [
    'DATABASE_URL',
    'ADMIN_EMAIL',
    'AUTZORG_APP_ID',
    'PAKASIR_SLUG',
    'PAKASIR_API_KEY',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM',
  ]
  requiredVars.forEach((key) => {
    if (!getEnv(key)) {
      throw new Error(`Missing environment variable: ${key}`)
    }
  })
}