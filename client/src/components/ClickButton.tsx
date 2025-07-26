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

  // 📡 خواندن مقدار clickFee از کانترکت
  const {
    data: clickFee,
    isLoading: loadingFee,
  } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'clickFee',
    watch: true,
  })

  // 📝 تنظیمات تابع click
  const { writeAsync } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'click',
    mode: 'recklesslyUnprepared',
  })

  // 🎯 اجرای کلیک
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isConnected) {
      alert('🦊 Please connect your wallet.')
      return
    }

    if (!clickFee) {
      alert('⏳ Waiting for fee to load...')
      return
    }

    // نمایش انفجار
    const rect = e.currentTarget.getBoundingClientRect()
    setExplosion({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    setTimeout(() => setExplosion(null), 1000)

    setStatus('pending')

    try {
      const fee =
        typeof clickFee === 'bigint'
          ? clickFee
          : BigInt(clickFee?.toString?.() || '0')

      console.log('👤 Address:', address)
      console.log('💰 Fee to send:', fee.toString())

      const tx = await writeAsync({
        recklesslySetUnpreparedArgs: [],
        recklesslySetUnpreparedOverrides: {
          value: fee,
        },
      })

      console.log('📤 Transaction sent:', tx.hash)
      setTxHash(tx.hash)
    } catch (err: any) {
      console.error('❌ TX Error:', err)
      alert('Transaction failed:\n' + (err?.message || 'Unknown error'))
      setStatus('error')
    }
  }

  // ⏳ بررسی وضعیت تراکنش
  useWaitForTransaction({
    hash: txHash,
    onSuccess: () => {
      console.log('✅ TX confirmed')
      setStatus('success')
      refetch()
    },
    onError: (error) => {
      console.error('❌ TX failed on confirmation:', error)
      setStatus('error')
    },
  })

  // 🖼️ رندر
  return (
    <div style={{ position: 'relative', marginTop: '1.5rem' }}>
      <button
        onClick={handleClick}
        disabled={status === 'pending' || loadingFee || !clickFee}
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

      <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
        {status === 'pending' && <p style={{ color: '#007bff' }}>⏳ Waiting for confirmation...</p>}
        {status === 'success' && <p style={{ color: 'green' }}>✅ Buzz confirmed!</p>}
        {status === 'error' && <p style={{ color: 'red' }}>❌ Transaction failed</p>}
      </div>
    </div>
  )
}
