import { configureChains, createClient } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

// ✅ شبکه Base به صورت دستی
const baseChain = {
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
      http: [import.meta.env.VITE_RPC_URL!], // ← استفاده از env
    },
    public: {
      http: [import.meta.env.VITE_RPC_URL!],
    },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://basescan.org' },
  },
  testnet: false,
}

// ✅ اتصال شبکه + provider
const { provider, webSocketProvider } = configureChains(
  [baseChain],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: import.meta.env.VITE_RPC_URL!,
      }),
    }),
    publicProvider(),
  ]
)

// ✅ ساخت کلاینت wagmi
export const config = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [
    new MetaMaskConnector({ chains: [baseChain] }),
    new WalletConnectConnector({
      chains: [baseChain],
      options: {
        projectId: import.meta.env.VITE_WC_PROJECT_ID!,
        showQrModal: false, // جلوگیری از باز شدن مودال تکراری
      },
    }),
  ],
})
