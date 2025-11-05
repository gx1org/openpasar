import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono()

app.get('/api/ok', (c) => {
    return c.json({ ok: true })
})

// Gunakan default export, bukan GET/POST satu-satu
export const config = {
  runtime: 'nodejs', // atau 'nodejs' kalau kamu butuh modul Node
}

export default handle(app)
