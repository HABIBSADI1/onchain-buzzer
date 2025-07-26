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

  // خواندن مقدار clickFee از کانترکت
  const {
  data: clickFeeRaw,
} = useContractRead({
  address: CONTRACT_ADDRESS,
  abi,
  functionName: 'clickFee',
})

const fee =
  typeof clickFeeRaw === 'bigint'
    ? clickFeeRaw
    : BigInt(clickFeeRaw?.toString?.() || '0')

// ...
const tx = await writeAsync({
  recklesslySetUnpreparedArgs: [],
  recklesslySetUnpreparedOverrides: {
    value: fee, // ✅ دقیقاً همون چیزی که از کانترکت گرفتیم
  },
})


  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const fee =
      typeof clickFeeRaw === 'bigint'
        ? clickFeeRaw
        : BigInt(clickFeeRaw?.toString?.() || '0')

    if (!isConnected) {
      alert('🦊 لطفاً کیف پول را متصل کنید.')
      return
    }

    if (!fee || fee === BigInt(0)) {
      alert('⛽ کارمزد بارگذاری نشده. لطفاً کمی صبر کنید...')
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    setExplosion({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    setTimeout(() => setExplosion(null), 1000)

    setStatus('pending')

    try {
      console.log('📍 Network: Base')
      console.log('👤 Wallet address:', address)
      console.log('💰 clickFee (wei):', fee.toString())
      console.log('📜 Contract:', CONTRACT_ADDRESS)

      const tx = await writeAsync({
        recklesslySetUnpreparedArgs: [],
        recklesslySetUnpreparedOverrides: {
          value: fee,
          // gasLimit: BigInt(150000), // اختیاری: برای شبکه‌های با محدودیت
        },
      })

      console.log('🚀 TX submitted:', tx.hash)
      setTxHash(tx.hash)
    } catch (err: any) {
      console.error('❌ TX Error (JSON-RPC):', err)
      alert('❌ تراکنش شکست خورد: ' + (err?.message || 'خطای ناشناخته'))
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
      console.error('❌ Confirm error:', err)
      setStatus('error')
    },
  })

  return (
    <div style={{ position: 'relative', marginTop: '1.5rem' }}>
      <button
        onClick={handleClick}
        disabled={status === 'pending' || !clickFeeRaw}
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
    </div>
  )
}
