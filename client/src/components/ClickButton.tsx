import { useState } from 'react'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import abi from '../abi.json'
import { getAddress, parseEther } from 'viem'
import Explosion from './Explosion'
import { useGameState } from '../hooks/useGameState'

const CONTRACT_ADDRESS = getAddress(import.meta.env.VITE_CONTRACT_ADDRESS!)

export default function ClickButton() {
  const { isConnected, address } = useAccount()
  const { refetch } = useGameState()
  const [explosion, setExplosion] = useState<{ x: number; y: number } | null>(null)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')

  const {
    data: clickFee,
    isLoading: loadingFee,
    error: feeError,
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
      alert('کیف پول متصل نیست یا مقدار فی لود نشده')
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    setExplosion({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    setTimeout(() => setExplosion(null), 1000)

    setStatus('pending')

    try {
      console.log('📍 شبکه: Base')
      console.log('👤 آدرس کاربر:', address)
      console.log('🪙 Click Fee:', clickFee.toString())
      console.log('📩 ارسال تراکنش به:', CONTRACT_ADDRESS)

      const tx = await writeAsync({
        recklesslySetUnpreparedArgs: [],
        recklesslySetUnpreparedOverrides: {
          value: BigInt(clickFee.toString()), // اطمینان از نوع bigint
        },
      })

      console.log('📤 تراکنش ارسال شد:', tx.hash)
      setTxHash(tx.hash)
    } catch (err: any) {
      console.error('❌ خطای تراکنش:', err)
      alert('تراکنش شکست خورد: ' + (err?.message || 'خطای ناشناخته'))
      setStatus('error')
    }
  }

  useWaitForTransaction({
    hash: txHash,
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
        disabled={status === 'pending' || loadingFee}
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
      {status === 'pending' && <p style={{ color: '#007bff', marginTop: '0.5rem' }}>⏳ Waiting for confirmation...</p>}
      {feeError && <p style={{ color: 'red' }}>❗ خطا در خواندن فی: {feeError.message}</p>}
    </div>
  )
}
