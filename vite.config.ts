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
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
  include: ['buffer'],
  esbuildOptions: {
    define: {
      global: 'globalThis',
    },
    plugins: [
      NodeGlobalsPolyfillPlugin({ process: true, buffer: true }),
      NodeModulesPolyfillPlugin(),
    ],
  },
}
,
  build: {
    rollupOptions: {
      external: [
        '@safe-global/safe-apps-provider',
        '@safe-global/safe-apps-sdk',
        '@safe-globalThis/safe-apps-provider',
        '@safe-globalThis/safe-apps-sdk',
      ],
    },
  },
})
