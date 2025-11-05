import { handle } from 'hono/vercel'
import app from '../src/index.js'

// Gunakan default export, bukan GET/POST satu-satu
export const config = {
  runtime: 'edge', // atau 'nodejs' kalau kamu butuh modul Node
}

export default handle(app)

