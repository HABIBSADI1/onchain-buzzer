import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { WagmiConfig } from 'wagmi'
import { client } from './wagmi'
import { ConnectKitProvider } from 'connectkit'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <ConnectKitProvider
        theme="auto"
        options={{
          enforceSupportedChains: true,
          hideAvatar: true,
          walletConnectCTA: 'modal', // ✅ فعال بودن QR و fallback برای کیف‌های مختلف
          customTheme: {
            '--ck-overlay-background': 'rgba(0,0,0,0.6)',
            '--ck-connectbutton-background': '#0052FF',
            '--ck-connectbutton-color': '#ffffff',
            '--ck-connectbutton-hover-background': '#003dcc',
            '--ck-primary-button-background': '#0052FF',
          },
        }}
      >
        <App />
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>
)
