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
          walletConnectCTA: 'modal', // ✅ فقط از ConnectKit برای QR استفاده میشه
          customTheme: {
            '--ck-overlay-background': 'rgba(0,0,0,0.6)',
          },
        }}
      >
        <App />
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>
)
