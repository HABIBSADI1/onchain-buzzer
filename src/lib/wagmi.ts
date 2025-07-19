// src/lib/wagmi.ts
import { createConfig } from 'wagmi'
import { base } from 'viem/chains'
import { getDefaultConfig } from 'connectkit'

export const config = createConfig(
  getDefaultConfig({
    appName: 'Onchain Buzzer',
    walletConnectProjectId: 'a450272bbef8c0cf05ad341f47cee9cd',
    chains: [base],
  })
)
