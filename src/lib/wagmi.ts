// src/lib/wagmi.ts
import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'

// Base chain is already included in wagmi/chains as `base`

export const config = createConfig(
  getDefaultConfig({
    appName: 'Onchain Buzzer',
    chains: [base],
    transports: {
      [base.id]: http('https://mainnet.base.org')
    },
    walletConnectProjectId: 'a450272bbef8c0cf05ad341f47cee9cd'
  })
)
