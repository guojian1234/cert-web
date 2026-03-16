import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path' // 👈 新增：引入 path

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // 👈 将 @ 映射到 src 目录
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})