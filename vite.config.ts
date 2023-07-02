import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VITE_APP_API_KEY, VITE_APP_API_URL } from './env'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: VITE_APP_API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          ...(VITE_APP_API_KEY && { 'X-API-Key': VITE_APP_API_KEY }),
          Referer: 'https://www.rijksmuseum.nl'
        }
      }
    }
  }
})
