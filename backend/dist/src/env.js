import dotenv from 'dotenv';
// Load .env hanya kalau dijalankan lokal
if (!process.env.VERCEL && !process.env.CF_PAGES) {
    dotenv.config();
}
// Helper function agar lebih aman
export const getEnv = (key, fallback) => {
    const value = process.env[key];
    if (!value && fallback === undefined) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value ?? fallback;
};
export const envCheck = () => {
    const requiredVars = [
        'DATABASE_URL',
        'JWT_SECRET',
    ];
    requiredVars.forEach((key) => {
        if (!getEnv(key)) {
            throw new Error(`Missing environment variable: ${key}`);
        }
    });
};
