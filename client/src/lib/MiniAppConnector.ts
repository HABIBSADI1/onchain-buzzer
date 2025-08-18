/*
 * MiniAppConnector
 *
 * A custom wagmi connector for Farcaster mini apps.  This connector
 * leverages the Farcaster miniapp SDK to obtain an Ethereum
 * provider from the embedding Farcaster client.  It exposes the
 * minimal set of methods expected by wagmi for account management
 * and chain switching.  When used in a normal browser context the
 * connector will still compile, but it will fail to connect since
 * the Farcaster SDK is not available.
 */

// Import the generic Connector base class from wagmi.  The exact
// import path depends on the wagmi version; in v0.12 the base class
// is exported from '@wagmi/core'.  We import via @wagmi/core to
// avoid pulling in node polyfills for browser builds.  TypeScript
// will resolve this at compile time.
import { Connector } from '@wagmi/core'
import type { Chain } from 'wagmi'
import type { Address } from 'viem'

// Import the Farcaster miniapp SDK.  This package is installed as a
// dependency and bundled with the client build.  It exposes a
// `wallet.getEthereumProvider()` method to retrieve an injected
// provider from the Farcaster runtime.
import { sdk } from '@farcaster/miniapp-sdk'

export interface MiniAppConnectorOptions {
  /** The chains supported by this connector.  Only the first chain is used. */
  chains: Chain[]
}

export class MiniAppConnector extends Connector {
  readonly id = 'farcasterMiniApp'
  readonly name = 'Farcaster Mini App'
  readonly ready = true

  private provider: any | null = null
  private chains: Chain[]

  constructor({ chains }: MiniAppConnectorOptions) {
    // Pass empty options up to the base Connector.  The base class
    // accepts an options object with a chains property but does not
    // require any specific shape for custom connectors.
    super({ chains })
    this.chains = chains
  }

  /**
   * Lazily obtain the Ethereum provider from the Farcaster runtime.  The
   * miniapp SDK exposes a `wallet.getEthereumProvider()` method which
   * returns a provider compatible with EIP-1193.  We call
   * `sdk.actions.ready()` first to signal that our app is ready and to
   * ensure the SDK is initialised.  The provider is cached for
   * subsequent calls.
   */
  async getProvider(): Promise<any> {
    if (!this.provider) {
      try {
        // Attempt to call ready() in case the host is waiting for a
        // readiness signal.  Ignore errors when not in a Farcaster
        // context.
        await sdk.actions.ready().catch(() => {})
        this.provider = await sdk.wallet.getEthereumProvider()
      } catch (err) {
        throw new Error('Farcaster provider not available')
      }
    }
    return this.provider
  }

  /**
   * Establish a connection to the provider.  This triggers the
   * `eth_requestAccounts` RPC on the provider and returns the
   * connected account and chain information expected by wagmi.  The
   * provider always operates on a single chain; we parse the chainId
   * from hex to number.
   */
  async connect(): Promise<{ account: Address; chain: { id: number; unsupported: boolean } }> {
    const provider = await this.getProvider()
    const accounts: Address[] = await provider.request({ method: 'eth_requestAccounts' })
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts returned from provider')
    }
    const chainIdHex: string = await provider.request({ method: 'eth_chainId' })
    const chainId = parseInt(chainIdHex, 16)
    return {
      account: accounts[0],
      chain: { id: chainId, unsupported: false },
    }
  }

  /**
   * Disconnect is a no-op for the miniapp provider.  The Farcaster
   * runtime manages the lifetime of the provider; we simply drop our
   * cached provider so the next connect() call will request
   * accounts again.
   */
  async disconnect(): Promise<void> {
    this.provider = null
  }

  /**
   * Retrieve the currently connected account, if any, without
   * triggering a wallet prompt.  Returns undefined if no account is
   * connected.
   */
  async getAccount(): Promise<Address | undefined> {
    try {
      const provider = await this.getProvider()
      const accounts: Address[] = await provider.request({ method: 'eth_accounts' })
      return accounts && accounts.length > 0 ? accounts[0] : undefined
    } catch {
      return undefined
    }
  }

  /**
   * Get the current chain id from the provider.  Returns a number.
   */
  async getChainId(): Promise<number> {
    const provider = await this.getProvider()
    const chainIdHex: string = await provider.request({ method: 'eth_chainId' })
    return parseInt(chainIdHex, 16)
  }

  /**
   * Determine if the user has already connected an account.  This
   * method is used by wagmi to skip prompting the user when an
   * authorised session exists.
   */
  async isAuthorized(): Promise<boolean> {
    try {
      const account = await this.getAccount()
      return Boolean(account)
    } catch {
      return false
    }
  }

  /**
   * Switch the active chain.  The Farcaster provider supports
   * `wallet_switchEthereumChain` to prompt the user to switch
   * networks.  We throw an error if the request fails.
   */
  async switchChain(chainId: number): Promise<Chain> {
    const provider = await this.getProvider()
    const hexChainId = '0x' + chainId.toString(16)
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: hexChainId }],
    })
    const chain = this.chains.find((c) => c.id === chainId)
    if (!chain) throw new Error(`Unsupported chain ${chainId}`)
    return chain
  }
}