import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ""); // reuse vite's env parser to inject into our index.html
  const htmlPlugin = () => {
    return {
      name: "html-transform",
      transformIndexHtml(html) {
        if (env.VITE_ENV == 'production') {
          html = html.replace('<!-- tracker -->', `<script async defer data-website-id="2c09a06e-c923-4952-81f2-aa4343104b40" src="https://wazone-umami.vercel.app/umami.js"></script>`);
        }
        return html
      },
    };
  };

  return {
    plugins: [vue(), htmlPlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // eslint-disable-next-line no-undef
        '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      }
    }
  }
})
