import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import rollupNodePolyfills from 'rollup-plugin-node-polyfills'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',

      // در صورتی که به Safe نیاز داری (در پروژه فعلی نداری اما برای احتیاط)
      '@safe-globalThis/safe-apps-sdk': '@safe-global/safe-apps-sdk',
      '@safe-globalThis/safe-apps-provider': '@safe-global/safe-apps-provider',
      '@safe-globalThis/safe-gateway-typescript-sdk':
        '@safe-global/safe-gateway-typescript-sdk',
    },
  },
  define: {
    global: 'globalThis', // برای حل مشکل global is not defined
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
    exclude: ['@base-org/account'], // اگر وجود داره در پروژه‌ات
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      plugins: [rollupNodePolyfills()],
      external: ['@base-org/account'], // برای جلوگیری از باگ‌های هنگام build
    },
  },
})
