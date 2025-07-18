import * as dotenv from 'dotenv'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'
import abi from './abi.json'

dotenv.config()

const CONTRACT_ADDRESS = '0xFf2b0FA2ccd7Fa8f872c902628a1217C1B8fc1a3'
const RPC_URL = 'https://base-mainnet.public.blastapi.io'

const privateKey = process.env.PRIVATE_KEY || ''
if (!privateKey || privateKey.length !== 66) {
  throw new Error('❌ .env PRIVATE_KEY is missing or invalid (must start with 0x)')
}
const account = privateKeyToAccount(privateKey as `0x${string}`)

const publicClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
})

const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(RPC_URL),
})

async function checkAndPayout() {
  try {
    const state: any = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'getGameState',
    })

    const timeRemaining = Number(state[3])
    console.log('⏱️ Time remaining:', timeRemaining)

    if (timeRemaining === 0) {
      console.log('✅ Triggering forcePayout...')

      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'forcePayout',
        account: account.address,
      })

      const txHash = await walletClient.writeContract(request)
      console.log('🚀 TX sent:', txHash)
    }
  } catch (err: any) {
    console.error('❌ Error:', err.shortMessage || err.message || err)
  }
}

setInterval(checkAndPayout, 30_000)
console.log('👀 Listening for expired rounds...')
