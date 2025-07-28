import { publicClient } from '../wagmi'

export async function fetchGameState() {
  const [roundId, lastPlayer, pot, timeRemaining, clicks] =
    await publicClient.readContract({
      address: import.meta.env.VITE_CONTRACT_ADDRESS,
      abi: [...], // ABI getGameState
      functionName: 'getGameState',
    })
  return { roundId, lastPlayer, pot, timeRemaining, clicks }
}

export async function fetchLastRound() {
  const total: bigint = await publicClient.readContract({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: [...], // ABI totalRounds
    functionName: 'totalRounds',
  })
  if (total === 0n) return null
  const round = await publicClient.readContract({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: [...], // ABI getRound
    functionName: 'getRound',
    args: [total - 1n],
  })
  return {
    roundId: round[0],
    winner: round[1],
    reward: round[2].toString(),
    timestamp: round[3],
  }
}
