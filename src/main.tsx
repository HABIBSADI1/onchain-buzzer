import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { WagmiConfig } from 'wagmi'
import { client } from './wagmi'
import { ConnectKitProvider } from 'connectkit'

import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <ConnectKitProvider
        theme="auto"
        options={{
          enforceSupportedChains: true,
          hideAvatar: true,
          walletConnectCTA: 'never', // 👈 جلوی QR دوبل رو می‌گیره
          customTheme: {
            '--ck-overlay-background': 'rgba(0,0,0,0.6)', // تم تیره‌تر برای modal
          },
        }}
      >
        <App />
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>
)
