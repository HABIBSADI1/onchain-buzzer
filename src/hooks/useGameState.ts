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
      { name: 'roundId', type: 'uint256' },
      { name: 'pot', type: 'uint256' },
      { name: 'clickCount', type: 'uint256' },
      { name: 'lastPlayer', type: 'address' },
      { name: 'timeRemaining', type: 'uint256' },
    ],
  },
] as const

export function useGameState() {
  const { data, isLoading, refetch } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'getGameState',
    // ✅ NO watch
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
    if (
      data &&
      typeof data === 'object' &&
      'roundId' in data &&
      'pot' in data &&
      'clickCount' in data &&
      'lastPlayer' in data &&
      'timeRemaining' in data
    ) {
      const { roundId, pot, clickCount, lastPlayer, timeRemaining } = data as any
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
