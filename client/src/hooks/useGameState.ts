import { useContractRead } from 'wagmi'
import abi from '../abi.json'

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`

export function useGameState() {
  const { data, isLoading, refetch } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'getGameState',
    watch: true,
  })

  const [
    roundId = 0n,
    lastPlayer = '0x0000000000000000000000000000000000000000',
    pot = 0n,
    timeRemaining = 0n,
    clickCount = 0n,
  ] = (data as any[]) ?? []

  return {
    roundId,
    lastPlayer,
    pot,
    timeRemaining: Number(timeRemaining),
    clickCount,
    isLoading,
    refetch,
  }
}
