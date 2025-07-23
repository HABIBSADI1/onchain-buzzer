import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@wagmi/connectors/safe': './src/lib/empty.ts',
    },
  },
  optimizeDeps: {
    exclude: ['@wagmi/connectors/safe'],
  },
  define: {
    'process.env': {}, // جلوگیری از ارور Buffer در برخی پکیج‌ها
  },
  server: {
    proxy: {
      '/rounds': {
        target: 'https://insightful-enjoyment-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
