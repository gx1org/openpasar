import { Hono } from 'hono';
 
const app = new Hono();

app.get('/api/ok', (c) => {
    return c.json({ ok: true })
})

export default app;