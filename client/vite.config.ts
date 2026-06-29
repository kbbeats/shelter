import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shelter/shared': path.resolve(__dirname, '../shared/index.ts'),
    },
  },
  server: {
    // Bind to all interfaces so a phone on the same Wi-Fi can reach the dev server
    // at http://<LAN-IP>:5173 (needed for real-device testing). Dev-only; no effect
    // on the production build.
    host: true,
    port: Number(process.env.PORT) || 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
