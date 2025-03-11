import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    // host: '0.0.0.0', // Allows access from external devices on your network
    host:''
    port: 5173, // You can change the port if needed
  },
})
