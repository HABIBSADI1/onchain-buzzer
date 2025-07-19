import { useEffect, useState } from 'react'
import { useContractRead } from 'wagmi'

const CONTRACT_ADDRESS = '0xFf2b0FA2ccd7Fa8f872c902628a1217C1B8fc1a3'

const abi = [
  {
    name: 'getGameState',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: '_roundId', type: 'uint256' },
      { name: '_lastPlayer', type: 'address' },
      { name: '_pot', type: 'uint256' },
      { name: '_timeRemaining', type: 'uint256' },
      { name: '_clicks', type: 'uint256' }
    ],
  },
] as const

export function useGameState() {
  const { data, isLoading, refetch } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'getGameState',
  })

  const [state, setState] = useState<{
    roundId: bigint
    pot: bigint
    clickCount: number
    lastPlayer: string
    timeRemaining: number
  }>({
    roundId: 0n,
    pot: 0n,
    clickCount: 0,
    lastPlayer: '',
    timeRemaining: 0,
  })

  useEffect(() => {
    if (Array.isArray(data)) {
      const [roundId, lastPlayer, pot, timeRemaining, clickCount] = data
      setState({
        roundId,
        pot,
        clickCount: Number(clickCount),
        lastPlayer,
        timeRemaining: Number(timeRemaining),
      })
    }
  }, [data])

  return {
    ...state,
    isLoading,
    refetch,
  }
}
