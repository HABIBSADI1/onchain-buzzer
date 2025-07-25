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
    server: {
  proxy: {
    '/rounds': 'http://localhost:3000'
  }
}
  }
})
