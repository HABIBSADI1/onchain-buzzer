import { useWriteContract, useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { parseEther, getAddress } from 'viem'
import Explosion from './Explosion'
import { useGameState } from '../hooks/useGameState'

const CONTRACT_ADDRESS = getAddress('0xFf2b0FA2ccd7Fa8f872c902628a1217C1B8fc1a3')

export default function ClickButton() {
  const { address, isConnected } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()
  const { refetch, timeRemaining } = useGameState()

  const [explosionCoords, setExplosionCoords] = useState<{ x: number; y: number } | null>(null)
  const [txStatus, setTxStatus] = useState<'idle' | 'success' | 'error' | 'settling'>('idle')

  const handleClick = async (e: React.MouseEvent) => {
    if (!isConnected) return

    // درحال تسویه
    if (timeRemaining === 0) {
      setTxStatus('settling')
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    setExplosionCoords({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })

    try {
      setTxStatus('idle')
      await writeContractAsync({
        abi: [
          {
            name: 'click',
            type: 'function',
            stateMutability: 'payable',
            inputs: [],
            outputs: [],
          },
        ],
        address: CONTRACT_ADDRESS,
        functionName: 'click',
        value: parseEther('0.00005'),
      })

      setTxStatus('success')
      setTimeout(() => refetch(), 600)
    } catch (err) {
      console.error('TX Error:', err)
      setTxStatus('error')
    }
  }

  return (
    <div style={{ position: 'relative', marginTop: '1.5rem' }}>
      <button
        onClick={handleClick}
        disabled={isPending || !isConnected}
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

      {txStatus === 'success' && (
        <p style={{ color: 'green', marginTop: '0.5rem' }}>✅ Buzz confirmed!</p>
      )}
      {txStatus === 'error' && (
        <p style={{ color: 'red', marginTop: '0.5rem' }}>❌ Transaction failed</p>
      )}
      {txStatus === 'settling' && (
        <p style={{ color: '#ffaa00', marginTop: '0.5rem' }}>
          ⏳ Round is settling, please wait a moment...
        </p>
      )}
    </div>
  )
}
