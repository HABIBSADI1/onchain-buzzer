import { useContractRead } from 'wagmi'

const CONTRACT_ADDRESS = '0x569deCe8ee351a417dFc20E848c6186631aef696'

export function useGameState() {
  const { data, isLoading, refetch } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: [
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
          { name: '_clicks', type: 'uint256' },
        ],
      },
    ],
    functionName: 'getGameState',
    watch: true,
  })

  return {
    roundId: Number(data?.[0] || 0),
    lastPlayer: String(data?.[1] || '0x0000000000000000000000000000000000000000'),
    pot: BigInt(data?.[2] || 0),
    timeRemaining: Number(data?.[3] || 0),
    clickCount: Number(data?.[4] || 0),
    isLoading,
    refetch
  }
}
