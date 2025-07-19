// src/lib/wagmi.ts
import { createConfig } from 'wagmi'
import { getDefaultConfig } from 'connectkit'
import { base } from 'viem/chains'

export const config = createConfig(
  getDefaultConfig({
    appName: 'Onchain Buzzer',
    chains: [base],
    walletConnectProjectId: 'a450272bbef8c0cf05ad341f47cee9cd'
  })
)
