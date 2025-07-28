import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { getContract } from 'viem'
import abi from '../abi.json'

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`
const RPC_URL = import.meta.env.VITE_RPC_URL

if (!CONTRACT_ADDRESS || !RPC_URL) {
  throw new Error('❌ Missing VITE_CONTRACT_ADDRESS or VITE_RPC_URL in env variables.')
}

export const publicClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
})

export const contract = getContract({
  address: CONTRACT_ADDRESS,
  abi,
  client: publicClient,
})

// ✅ تابعی برای گرفتن اطلاعات وضعیت بازی
export async function fetchGameState() {
  return await contract.read.getGameState()
}

// ✅ تابعی برای گرفتن آخرین برنده راند قبل
export async function fetchLastRound(roundId: bigint) {
  return await contract.read.getRound([roundId])
}
