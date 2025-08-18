import { useEffect, useState } from 'react'
import ClickButton from './components/ClickButton'
import CountdownTimer from './components/CountdownTimer'
import GameInfoTable from './components/GameInfoTable'
import RoundHistoryTable from './components/RoundHistoryTableFromLogs'
import ShareButton from './components/ShareButton'
import Header from './components/Header'
import Footer from './components/Footer'
import Explosion from './components/Explosion'
import ConnectButton from './components/ConnectButton'
import WinnerModal from './components/WinnerModal'

import { fetchGameState, fetchLastRound } from './lib/contract'

const containerStyle: React.CSSProperties = {
  backgroundColor: '#f7f9ff',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: '"Inter", sans-serif',
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return isMobile
}

export default function App() {
  const isMobile = useIsMobile()
  const [globalExplosion, setGlobalExplosion] = useState<{ x: number; y: number } | null>(null)

  const [showWinner, setShowWinner] = useState(false)
  const [winnerData, setWinnerData] = useState<{
    roundId: number
    winner: string
    rewardEth: string
  } | null>(null)

  // Explosion on global click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('button')) return
      setGlobalExplosion({ x: e.clientX, y: e.clientY })
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  // Winner Modal watcher
  useEffect(() => {
    let interval = setInterval(async () => {
      try {
        const { timeRemaining } = await fetchGameState()
        if (timeRemaining === 0) {
          const round = await fetchLastRound()
          if (round && round.timestamp > 0 && round.reward !== '0') {
            setWinnerData({
              roundId: round.roundId,
              winner: round.winner,
              rewardEth: (parseFloat(round.reward) / 1e18).toFixed(4),
            })
            setShowWinner(true)
            clearInterval(interval)
            setTimeout(() => setShowWinner(false), 5000)
          }
        }
      } catch (err) {
        console.warn('Failed to fetch winner state:', err)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={containerStyle}>
      <Header />

      <div style={{ position: 'absolute', top: '3rem', right: '1rem', zIndex: 50 }}>
        <ConnectButton />
      </div>

      <main
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: isMobile ? '1rem' : '2rem',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1280px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '1.5rem',
            alignItems: 'stretch',
          }}
        >
          <div
            style={{
              flex: 1,
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: isMobile ? '240px' : '580px',
            }}
          >
            <img
              src="/base.webp"
              alt="Base Image"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                borderRadius: '10px',
              }}
            />
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: isMobile ? 'auto' : '580px',
            }}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: isMobile ? '1.5rem' : '3rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexGrow: 1,
              }}
            >
              <CountdownTimer />
              <ClickButton />
            </div>

            <div
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '1rem',
                marginTop: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                textAlign: 'center',
              }}
            >
              <ShareButton />
            </div>

            <div
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '1.5rem',
                marginTop: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <h2
                style={{
                  color: '#002366',
                  marginBottom: '1rem',
                  fontWeight: 'bold',
                }}
              >
                🎯 Game Info
              </h2>
              <GameInfoTable />
            </div>
          </div>
        </div>
      </main>

      <div
        style={{
          background: '#f7f9ff',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1280px',
            background: '#fff',
            borderRadius: '16px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        >
          <RoundHistoryTable />
        </div>
      </div>

      <Footer />

      {globalExplosion && <Explosion x={globalExplosion.x} y={globalExplosion.y} type="logo" />}
      {showWinner && winnerData && (
        <WinnerModal
          roundId={winnerData.roundId}
          winner={winnerData.winner}
          rewardEth={winnerData.rewardEth}
          onClose={() => setShowWinner(false)}
        />
      )}
    </div>
  )
}
