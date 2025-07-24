import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'buffer'
    }
  },
  define: {
    'process.env': {}  // fix برای استفاده‌ی احتمالی از env در مرورگر
  },
  optimizeDeps: {
    include: ['buffer']
  },
  build: {
    outDir: 'dist/public',
    emptyOutDir: true
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://thriving-renewal-production.up.railway.app',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
