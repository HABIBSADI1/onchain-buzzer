import { createConfig } from 'wagmi'
import { getDefaultConfig } from 'connectkit'
import { base } from 'wagmi/chains'
import { http } from 'viem'

export const config = createConfig(
  getDefaultConfig({
    appName: 'Onchain Buzzer',
    walletConnectProjectId: 'a450272bbef8c0cf05ad341f47cee9cd',
    chains: [base],
    transports: {
      [base.id]: http("https://base-mainnet.infura.io/v3/0cc292f9dc31410e8c08cce78aa00be2"),
    },
  })
)
