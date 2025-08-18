import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { WagmiConfig } from 'wagmi'
import { client } from './wagmi'
import { ConnectKitProvider } from 'connectkit'

import './index.css'

// When running inside a Farcaster mini app we should notify the
// Farcaster runtime that the app is ready as soon as possible.  We
// import the SDK directly and call actions.ready() without awaiting
// the promise; errors are silently ignored when not in a Farcaster
// environment.  This ensures that Farcaster mini app hosts know
// precisely when our React app has mounted.
import { sdk } from '@farcaster/miniapp-sdk'

// Signal readiness at module load time.  Note that calling ready()
// multiple times is safe; the Farcaster SDK will ignore subsequent
// calls.
try {
  sdk.actions.ready()
} catch {
  // ignore if not in miniapp context
}

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
