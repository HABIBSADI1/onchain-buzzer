import React, { useEffect } from 'react'

interface WinnerModalProps {
  roundId: number
  winner: string
  rewardEth: string
  onClose: () => void
}

export default function WinnerModal({ roundId, winner, rewardEth, onClose }: WinnerModalProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>🎉 Congratulations!</h2>
        <p>
          <strong>{shorten(winner)}</strong> just won <strong>{rewardEth} ETH</strong> in round #{roundId}!
        </p>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>Closing in 5 seconds...</p>
        <button style={btnStyle} onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

const shorten = (addr: string) => addr.slice(0, 6) + '...' + addr.slice(-4)

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
}

const modalStyle: React.CSSProperties = {
  background: 'white',
  padding: '2rem',
  borderRadius: '12px',
  textAlign: 'center',
  maxWidth: '400px',
  boxShadow: '0 0 10px rgba(0,0,0,0.2)'
}

const btnStyle: React.CSSProperties = {
  marginTop: '1rem',
  padding: '0.6rem 1.2rem',
  backgroundColor: '#002366',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
}
