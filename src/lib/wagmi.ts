import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Onchain Buzzer',
  projectId: 'a450272bbef8c0cf05ad341f47cee9cd', 
  chains: [base],
  ssr: false,
  metadata: {
    name: 'Onchain Buzzer',
    description: 'Buzz to win on Base!',
    url: 'http://localhost:5173',
    icons: ['https://base.org/favicon.ico'],
  },
})
