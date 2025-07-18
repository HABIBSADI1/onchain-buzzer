import { useContractWrite, useWaitForTransaction, useAccount } from 'wagmi'
import { useState } from 'react'
import { parseEther, getAddress } from 'viem'
import Explosion from './Explosion'
import { useGameState } from '../hooks/useGameState'

const CONTRACT_ADDRESS = getAddress('0xFf2b0FA2ccd7Fa8f872c902628a1217C1B8fc1a3')

const abi = [
  {
    name: 'click',
    type: 'function',
    stateMutability: 'payable',
    inputs: [],
    outputs: [],
  },
] as const

export default function ClickButton() {
  const { isConnected } = useAccount()
  const { refetch } = useGameState()

  const [explosionCoords, setExplosionCoords] = useState<{ x: number; y: number } | null>(null)
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null)
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error' | 'settling'>('idle')

  const { write, isLoading: isWriting } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'click',
    value: parseEther('0.00005'),
    onSuccess: (tx) => {
      setStatus('pending')
      setTxHash(tx.hash)
    },
    onError: (error) => {
      const msg = error.message || ''
      if (msg.includes('Round not settled')) {
        setStatus('settling')
      } else {
        setStatus('error')
      }
    },
  })

  useWaitForTransaction({
    hash: txHash,
    onSuccess: () => {
      setStatus('success')
      refetch() // ✅ دستی
    },
    onError: () => {
      setStatus('error')
    },
  })

  const handleClick = (e: React.MouseEvent) => {
    if (!isConnected || isWriting) return
    const rect = e.currentTarget.getBoundingClientRect()
    setExplosionCoords({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    setStatus('idle')
    write?.()
  }

  return (
    <div style={{ position: 'relative', marginTop: '1.5rem' }}>
      <button
        onClick={handleClick}
        disabled={isWriting || !isConnected}
        style={{
          background: '#0052FF',
          color: '#fff',
          padding: '1rem 2.5rem',
          fontSize: '1.2rem',
          borderRadius: '12px',
          border: 'none',
          boxShadow: '0 0 12px rgba(0,82,255,0.4)',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        🔥 CLICK TO BUZZ
      </button>

      {explosionCoords && (
        <Explosion x={explosionCoords.x} y={explosionCoords.y} type="emoji" />
      )}

      {status === 'success' && <p style={{ color: 'green', marginTop: '0.5rem' }}>✅ Buzz confirmed!</p>}
      {status === 'error' && <p style={{ color: 'red', marginTop: '0.5rem' }}>❌ Transaction failed</p>}
      {status === 'settling' && <p style={{ color: '#ff9900', marginTop: '0.5rem' }}>⚠️ Settling last round, try again shortly</p>}
    </div>
  )
}
