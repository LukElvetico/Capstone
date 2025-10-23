// File: vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 🚨 AGGIUNTO IL PROXY PER RISOLVERE IL 404 (Not Found)
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // <-- Assumi che il tuo backend sia qui
        changeOrigin: true,
        secure: false, // Utile per lo sviluppo locale
      },
    },
  },
})