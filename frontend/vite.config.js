import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0', // '0.0.0.0' en lugar de '127.0.0.1' para que se exponga en el contenedor
    // En Windows (repo fuera de WSL2) Docker no propaga los eventos de archivo: sin polling, el hot reload no ve los cambios.
    watch: {
      usePolling: true,
      interval: 500
    },
    proxy: {
      '/api': process.env.BACKEND_URL || 'http://127.0.0.1:3000'
    }
  },
})