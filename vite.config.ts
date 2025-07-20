import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import rollupNodePolyfills from 'rollup-plugin-node-polyfills';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      crypto: 'rollup-plugin-node-polyfills/polyfills/crypto',
    },
  },
  define: {
    global: 'globalThis' // ✅ اضافه‌شده برای حل خطای global is not defined
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
    exclude: ['@base-org/account']
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      plugins: [rollupNodePolyfills()],
      external: ['@base-org/account']
    },
  },
});
