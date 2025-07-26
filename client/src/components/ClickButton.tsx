import { useState } from 'react'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import abi from '../abi.json'
import { getAddress } from 'viem'
import Explosion from './Explosion'
import { useGameState } from '../hooks/useGameState'

const CONTRACT_ADDRESS = getAddress(import.meta.env.VITE_CONTRACT_ADDRESS!)

export default function ClickButton() {
  const { isConnected, address } = useAccount()
  const { refetch } = useGameState()
  const [explosion, setExplosion] = useState<{ x: number; y: number } | null>(null)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    data: clickFee,
    isLoading: loadingFee,
  } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'clickFee',
    watch: true,
  })

  const { writeAsync } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'click',
    mode: 'recklesslyUnprepared',
  })

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isConnected || !clickFee) {
      alert('🦊 لطفاً ابتدا کیف پول را متصل کرده و منتظر لود شدن کارمزد باشید.')
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    setExplosion({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    setTimeout(() => setExplosion(null), 1000)

    setStatus('pending')
    setErrorMessage(null)

    try {
      console.log('👤 Wallet:', address)
      console.log('💰 Click Fee (wei):', clickFee.toString())
      console.log('📍 Contract:', CONTRACT_ADDRESS)

      const tx = await writeAsync({
        recklesslySetUnpreparedArgs: [],
        recklesslySetUnpreparedOverrides: {
          value: clickFee,
        },
      })

      console.log('🚀 Transaction sent:', tx.hash)
      setTxHash(tx.hash)
    } catch (err: any) {
      console.error('❌ Transaction failed:', err)
      setErrorMessage(err?.message || 'خطای ناشناخته در تراکنش')
      setStatus('error')
    }
  }

  useWaitForTransaction({
    hash: txHash,
    onSuccess: () => {
      console.log('✅ Transaction confirmed:', txHash)
      setStatus('success')
      refetch()
    },
    onError: (err) => {
      console.error('❌ Transaction error:', err)
      setErrorMessage('تراکنش تایید نشد.')
      setStatus('error')
    },
  })

  return (
    <div style={{ position: 'relative', marginTop: '1.5rem' }}>
      <button
        onClick={handleClick}
        disabled={status === 'pending' || !clickFee}
        style={{
          backgroundColor: '#0052FF',
          color: '#fff',
          padding: '1rem 2.5rem',
          fontSize: '1.2rem',
          fontWeight: 600,
          border: 'none',
          borderRadius: '12px',
          cursor: status === 'pending' || !clickFee ? 'not-allowed' : 'pointer',
          boxShadow: '0 0 12px rgba(0,82,255,0.4)',
        }}
      >
        🔥 CLICK TO BUZZ
      </button>

      {explosion && <Explosion x={explosion.x} y={explosion.y} type="emoji" />}
      {status === 'success' && <p style={{ color: 'green', marginTop: '0.5rem' }}>✅ Buzz confirmed!</p>}
      {status === 'error' && (
        <p style={{ color: 'red', marginTop: '0.5rem' }}>
          ❌ Transaction failed<br />
          {errorMessage}
        </p>
      )}
      {status === 'pending' && (
        <p style={{ color: '#007bff', marginTop: '0.5rem' }}>⏳ Waiting for confirmation...</p>
      )}
    </div>
  )
}
