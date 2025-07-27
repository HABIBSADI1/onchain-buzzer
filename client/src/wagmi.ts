import { configureChains, createClient } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'

const baseChain = {
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: [import.meta.env.VITE_RPC_URL!] } },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://basescan.org' },
  },
  testnet: false,
}

const { chains, provider, webSocketProvider } = configureChains(
  [baseChain],
  [jsonRpcProvider({ rpc: () => ({ http: import.meta.env.VITE_RPC_URL! }) })]
)

export const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }), // ✅ برای injected wallets مثل MetaMask و Rabby
    new CoinbaseWalletConnector({
      chains,
      options: { appName: 'Final Click' },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: import.meta.env.VITE_WC_PROJECT_ID!,
        showQrModal: true, // ✅ اجازه می‌ده بقیه کیف‌ها اضافه شن
        metadata: {
          name: 'Final Click',
          description: 'Buzz and win ETH!',
          url: 'https://finalclick.xyz',
          icons: ['https://finalclick.xyz/logo.png'],
        },
      },
    }),
  ],
  provider,
  webSocketProvider,
})
