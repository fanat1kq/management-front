import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002, // Меняем на нужный порт
    open: true  // Автоматически открывать браузер
  }
})