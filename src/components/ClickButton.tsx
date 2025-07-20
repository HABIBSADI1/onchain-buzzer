import { useState } from 'react'
import { useContractWrite, useWaitForTransaction, useAccount } from 'wagmi'  // ✅ اصلاح شده
import { parseEther, getAddress } from 'viem'
import Explosion from './Explosion'
import { useGameState } from '../hooks/useGameState'

const CONTRACT_ADDRESS = getAddress('0xFf2b0FA2ccd7Fa8f872c902628a1217C1B8fc1a3')

const ABI = [
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

  const [explosion, setExplosion] = useState<{ x: number; y: number } | null>(null)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error' | 'settling'>('idle')

  const { writeContractAsync } = useContractWrite()

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isConnected) return

    const rect = e.currentTarget.getBoundingClientRect()
    setExplosion({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    setTimeout(() => setExplosion(null), 1000)

    setStatus('pending')
    try {
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'click',
        value: parseEther('0.00005'),
      })
      setTxHash(tx)
    } catch (err: any) {
      const msg = err.message || ''
      setStatus(msg.includes('Round not settled') ? 'settling' : 'error')
    }
  }

  useWaitForTransaction({
    hash: txHash,
    enabled: !!txHash,
    onSuccess: () => {
      setStatus('success')
      refetch()
    },
    onError: () => {
      setStatus('error')
    },
  })

  return (
    <div style={{ position: 'relative', marginTop: '1.5rem' }}>
      <button
        onClick={handleClick}
        disabled={!isConnected || status === 'pending'}
        style={{
          backgroundColor: '#0052FF',
          color: '#fff',
          padding: '1rem 2.5rem',
          fontSize: '1.2rem',
          fontWeight: 600,
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 0 12px rgba(0,82,255,0.4)',
        }}
      >
        🔥 CLICK TO BUZZ
      </button>

      {explosion && <Explosion x={explosion.x} y={explosion.y} type="emoji" />}

      {status === 'success' && <p style={{ color: 'green', marginTop: '0.5rem' }}>✅ Buzz confirmed!</p>}
      {status === 'error' && <p style={{ color: 'red', marginTop: '0.5rem' }}>❌ Transaction failed</p>}
      {status === 'settling' && <p style={{ color: '#ff9900', marginTop: '0.5rem' }}>⚠️ Settling last round, try again shortly</p>}
      {status === 'pending' && <p style={{ color: '#007bff', marginTop: '0.5rem' }}>⏳ Waiting for confirmation...</p>}
    </div>
  )
}
