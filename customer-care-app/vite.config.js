import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0', // Bind to all network interfaces for deployment
    open: true,
    allowedHosts: ['care-systems.onrender.com']
  },
  build: {
    outDir: 'dist'
  }
})
