import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process',
    },
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({ process: true, buffer: true }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  define: {
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      // ✅ این باعث میشه خطای Safe provider برطرف بشه
      external: ['@safe-global/safe-apps-provider'],
    },
  },
})
