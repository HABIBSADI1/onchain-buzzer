import { useEffect, useState } from 'react'
import { useGameState } from '../hooks/useGameState'

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function CountdownTimer() {
  const { timeRemaining } = useGameState()
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    if (typeof timeRemaining !== 'number') return
    setTimeLeft(timeRemaining)

    const interval = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0))
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
