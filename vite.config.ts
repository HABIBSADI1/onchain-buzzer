import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import rollupNodePolyfills from 'rollup-plugin-node-polyfills'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      
      // رفع ارورهای wagmi مربوط به Safe
      '@safe-globalThis/safe-apps-sdk': '@safe-global/safe-apps-sdk',
      '@safe-globalThis/safe-apps-provider': '@safe-global/safe-apps-provider',
      '@safe-globalThis/safe-gateway-typescript-sdk': '@safe-global/safe-gateway-typescript-sdk',
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
    exclude: [
      '@base-org/account',
      '@safe-global/safe-apps-sdk',
      '@safe-global/safe-apps-provider',
      '@safe-global/safe-gateway-typescript-sdk',
    ],
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      plugins: [rollupNodePolyfills()],
      external: [
        '@base-org/account',
        '@safe-global/safe-apps-sdk',
        '@safe-global/safe-apps-provider',
        '@safe-global/safe-gateway-typescript-sdk',
      ],
    },
  },
})
