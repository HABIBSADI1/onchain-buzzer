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
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'FinalClick',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: import.meta.env.VITE_WC_PROJECT_ID!,
        showQrModal: false, // ⛔ مهم: از QR modal داخلی ConnectKit استفاده کن
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
