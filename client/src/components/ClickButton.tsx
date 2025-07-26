import { useState } from 'react'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction
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

  // مقدار fee
  const { data: clickFee } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'clickFee',
    watch: true
  })

  // وضعیت تایمر
  const { data: timeRemaining } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'timeRemaining',
    watch: true
  })

  // وضعیت payout
  const { data: payoutDone } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'payoutDone',
    watch: true
  })

  // تابع کلیک کانترکت
  const { writeAsync } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'click',
    mode: 'recklesslyUnprepared'
  })

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isConnected || !clickFee || typeof timeRemaining !== 'bigint' || typeof payoutDone !== 'boolean') {
      alert('لطفاً کیف پول را وصل کنید و منتظر دریافت داده‌ها بمانید.')
      return
    }

    // اگر راند تسویه نشده یا تایمر صفر است، کلیک مجاز نیست
    if (timeRemaining === 0n) {
      alert('⛔ راند به پایان رسیده. ابتدا باید برنده مشخص شود.')
      return
    }

    if (!payoutDone) {
      alert('⛔ لطفاً صبر کنید تا راند قبلی تسویه شود.')
      return
    }

    // نمایش انفجار
    const rect = e.currentTarget.getBoundingClientRect()
    setExplosion({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    setTimeout(() => setExplosion(null), 1000)

    setStatus('pending')

    try {
      const tx = await writeAsync({
        recklesslySetUnpreparedArgs: [],
        recklesslySetUnpreparedOverrides: {
          value: clickFee
        }
      })

      setTxHash(tx.hash)
    } catch (err: any) {
      console.error('❌ Transaction Error:', err)
      alert('تراکنش شکست خورد: ' + (err?.message || 'خطای نامشخص'))
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
    }
  })

  return (
    <div style={{ position: 'relative', marginTop: '1.5rem' }}>
      <button
        onClick={handleClick}
        disabled={
          status === 'pending' ||
          !clickFee ||
          timeRemaining === 0n ||
          payoutDone === false
        }
        style={{
          backgroundColor: '#0052FF',
          color: '#fff',
          padding: '1rem 2.5rem',
          fontSize: '1.2rem',
          fontWeight: 600,
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 0 12px rgba(0,82,255,0.4)'
        }}
      >
        🔥 CLICK TO BUZZ
      </button>

      {explosion && <Explosion x={explosion.x} y={explosion.y} type="emoji" />}
      {status === 'success' && <p style={{ color: 'green', marginTop: '0.5rem' }}>✅ کلیک با موفقیت ثبت شد!</p>}
      {status === 'error' && <p style={{ color: 'red', marginTop: '0.5rem' }}>❌ تراکنش ناموفق بود.</p>}
      {status === 'pending' && <p style={{ color: '#007bff', marginTop: '0.5rem' }}>⏳ در حال انتظار برای تایید...</p>}
    </div>
  )
}
