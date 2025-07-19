// src/lib/wagmi.ts
import { createConfig, configureChains } from 'wagmi'
import { base } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultConfig } from 'connectkit'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [base],
  [publicProvider()]
)

export const config = createConfig(
  getDefaultConfig({
    appName: 'Onchain Buzzer',
    chains,
    publicClient,
    webSocketPublicClient,
    walletConnectProjectId: 'a450272bbef8c0cf05ad341f47cee9cd',
  })
)
