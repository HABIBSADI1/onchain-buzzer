// src/lib/wagmi.ts
import { chain, configureChains, createClient } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

// تعریف Base chain به‌صورت سفارشی
const baseChain = {
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: {
    decimals: 18,
    name: 'Base',
    symbol: 'ETH',
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
  testnet: false,
}

// اتصال به شبکه
const { provider, webSocketProvider } = configureChains(
  [baseChain],
  [
    jsonRpcProvider({
      rpc: () => ({ http: 'https://mainnet.base.org' }),
    }),
    publicProvider(),
  ]
)

// ایجاد کلاینت wagmi
export const config = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [
    new MetaMaskConnector({ chains: [baseChain] }),
    new WalletConnectConnector({
      chains: [baseChain],
      options: {
        projectId: 'a450272bbef8c0cf05ad341f47cee9cd',
        showQrModal: true,
      },
    }),
  ],
})
