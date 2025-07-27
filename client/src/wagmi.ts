import { configureChains, createClient } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'

const baseChain = {
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [import.meta.env.VITE_RPC_URL!] },
  },
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
        appName: 'Onchain Buzzer',
      },
    }),
    // ❌ Removed WalletConnectConnector: handled internally by ConnectKit
  ],
  provider,
  webSocketProvider,
})
