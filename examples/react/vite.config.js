import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8082,
    allowedHosts: ['ec2-44-219-199-246.compute-1.amazonaws.com']
  }
})
