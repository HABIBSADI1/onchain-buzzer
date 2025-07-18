import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import rollupNodePolyfills from 'rollup-plugin-node-polyfills'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      util: 'rollup-plugin-node-polyfills/polyfills/util',
    },
  },
  optimizeDeps: {
    include: ['buffer', 'process', 'util', 'stream'],
    esbuildOptions: {
      // Inject global polyfills
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  define: {
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      plugins: [
        // Inject rollup polyfills
        rollupNodePolyfills(),
      ],
    },
  },
})
