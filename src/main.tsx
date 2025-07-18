import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

import { config } from './lib/wagmi'
import { WagmiConfig } from 'wagmi'
import { ConnectKitProvider } from 'connectkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <App />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  </React.StrictMode>
)
