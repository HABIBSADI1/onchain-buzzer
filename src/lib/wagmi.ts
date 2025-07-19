// src/lib/wagmi.ts

import { createConfig, configureChains } from 'wagmi'
import { Chain } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultConfig } from 'connectkit'

// تعریف دستی شبکه Base
const baseChain: Chain = {
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.base.org'],
    },
    public: {
      http: ['https://mainnet.base.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://basescan.org' },
  },
}

// تنظیمات wagmi
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [baseChain],
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
