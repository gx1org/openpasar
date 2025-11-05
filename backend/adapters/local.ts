import { serve } from '@hono/node-server'
import app from '../src/index.js';
import { port } from '../src/config.js';

serve({
  fetch: app.fetch,
  port: Number(port)
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
