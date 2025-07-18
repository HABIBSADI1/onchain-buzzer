import { getDefaultConfig } from 'connectkit'
import { createConfig } from 'wagmi'
import { base } from 'wagmi/chains'

export const config = createConfig(
  getDefaultConfig({
    appName: 'Onchain Buzzer',
    walletConnectProjectId: 'a450272bbef8c0cf05ad341f47cee9cd',
    chains: [base],
    ssr: false,
    // 👇 این خط باعث می‌شه ENS خاموش بشه
    options: {
      appName: 'Onchain Buzzer',
      appDescription: 'Buzz to win on Base!',
      appUrl: 'https://onchain-buzzer.xyz',
      appIcon: 'https://base.org/favicon.ico',
    }
  })
)
