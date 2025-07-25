import { useEffect, useState } from 'react'
import { useContractWrite, useWaitForTransaction } from 'wagmi'
import { useGameState } from '../hooks/useGameState'
import { getAddress } from 'viem'

const CONTRACT_ADDRESS = getAddress('0xFf2b0FA2ccd7Fa8f872c902628a1217C1B8fc1a3')

const ABI = [
  {
    name: 'settle',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
] as const

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function CountdownTimer() {
  const { timeRemaining, refetch } = useGameState()
  const [seconds, setSeconds] = useState<number>(0)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()

  const { write } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'settle',
    onSuccess: (tx) => setTxHash(tx.hash),
  })

  useWaitForTransaction({
    hash: txHash,
    enabled: !!txHash,
    onSuccess: () => refetch(),
  })

  useEffect(() => {
    if (!timeRemaining || timeRemaining <= 0) return
    setSeconds(timeRemaining)

    const interval = setInterval(() => {
      setSeconds((s) => {
        const next = s - 1
        if (next === 0) write?.()
        return Math.max(next, 0)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining])

  return (
    <div style={{
      fontSize: '3.5rem',
      fontWeight: 900,
      color: '#0052FF',
      textShadow: '0 0 10px rgba(0, 82, 255, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
    }}>
      ⏱ <span>{formatTime(seconds)}</span>
    </div>
  )
}
