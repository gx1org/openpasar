import { serve } from '@hono/node-server';
import app from './index.js';
import { getEnv } from './env.js';
const port = getEnv('PORT', '7100');
serve({
    fetch: app.fetch,
    port: Number(port)
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
