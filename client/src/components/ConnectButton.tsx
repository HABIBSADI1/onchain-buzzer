import { ConnectKitButton } from 'connectkit'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { isMiniApp } from '../lib/isMiniApp'

/**
 * A wallet connect button that adapts to the Farcaster mini app
 * environment.  In a normal browser context we render the standard
 * ConnectKitButton, which integrates with the ConnectKit provider to
 * offer MetaMask/Coinbase/WalletConnect options.  When running
 * inside a Farcaster mini app we instead use wagmi hooks directly to
 * connect via our custom MiniAppConnector.  This avoids loading
 * external wallet libraries that are blocked by Farcaster's Content
 * Security Policy.
 */
export default function ConnectButton() {
  const miniApp = isMiniApp()
  const { address, isConnected } = useAccount()
  const { connect, connectors, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()

  // Helper to truncate an Ethereum address for display.
  const truncate = (addr: string): string =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

  if (miniApp) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        {isConnected && address ? (
          <button
            onClick={() => disconnect()}
            style={{
              backgroundColor: '#0052FF',
              color: '#fff',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            {truncate(address)}
          </button>
        ) : (
          <button
            disabled={isLoading}
            onClick={() => connect({ connector: connectors[0] })}
            style={{
              backgroundColor: '#0052FF',
              color: '#fff',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            {pendingConnector && isLoading ? 'Connecting...' : 'Connect'}
          </button>
        )}
      </div>
    )
  }

  // Default: render ConnectKitButton for full wallet experience
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
      <ConnectKitButton />
    </div>
  )
}
