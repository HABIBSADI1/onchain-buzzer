import { useEffect, useState } from 'react'
import { useGameState } from '../hooks/useGameState'
import { useContractWrite, useWaitForTransaction } from 'wagmi'
import { getAddress } from 'viem'

const CONTRACT_ADDRESS = getAddress('0xFf2b0FA2ccd7Fa8f872c902628a1217C1B8fc1a3')

const abi = [
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
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null)

  const { write } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'settle',
    onSuccess: (tx) => setTxHash(tx.hash),
  })

  useWaitForTransaction({
    hash: txHash,
    onSuccess: () => {
      refetch()
    },
  })

  useEffect(() => {
    if (typeof timeRemaining !== 'number') return
    setTimeLeft(timeRemaining)

    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t === 1) {
          write?.()
        }
        return Math.max(t - 1, 0)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining])

  return (
    <div style={{
      fontSize: '3.5rem',
      fontWeight: 900,
      letterSpacing: '2px',
      color: '#0052FF',
      textShadow: '0 0 12px rgba(0, 82, 255, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      animation: 'pulse 1.6s infinite',
    }}>
      <span role="img" aria-label="timer">⏱</span>
      <span>{formatTime(timeLeft)}</span>
    </div>
  )
}
