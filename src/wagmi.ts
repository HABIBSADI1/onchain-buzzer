import { createClient, configureChains } from 'wagmi'
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
  blockExplorers: { default: { name: 'Basescan', url: 'https://basescan.org' } },
  testnet: false,
}

const { chains, provider, webSocketProvider } = configureChains(
  [baseChain],
  [jsonRpcProvider({ rpc: () => ({ http: import.meta.env.VITE_RPC_URL! }) })]
)

export const client = createClient({
  autoConnect: true,
  connectors: () => [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: { appName: 'Onchain Buzzer' },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: import.meta.env.VITE_WC_PROJECT_ID!,
        showQrModal: false,
        metadata: {
          name: 'Onchain Buzzer',
          description: 'Buzz and win ETH',
          url: 'https://onchain-buzzer.xyz',
          icons: ['https://onchain-buzzer.xyz/logo.png'],
        },
      },
    }),
  ],
  provider,
  webSocketProvider,
})
