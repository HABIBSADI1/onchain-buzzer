// src/lib/wagmi.ts
import { createConfig, configureChains } from 'wagmi'
import { Chain } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

// تعریف شبکه Base
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

// تنظیمات chain و provider
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [baseChain],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: () => ({ http: 'https://mainnet.base.org' }),
    }),
  ]
)

export const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [], // اگر از connectkit استفاده نمی‌کنی، اینو خالی بذار
})
