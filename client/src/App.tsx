import { useEffect, useState } from 'react'
import ClickButton from './components/ClickButton'
import CountdownTimer from './components/CountdownTimer'
import GameInfoTable from './components/GameInfoTable'
import RoundHistoryTable from "./components/RoundHistoryTableFromLogs";
import ShareButton from './components/ShareButton'
import Header from './components/Header'
import Footer from './components/Footer'
import Explosion from './components/Explosion'
import ConnectButton from './components/ConnectButton'

const containerStyle: React.CSSProperties = {
  backgroundColor: '#f7f9ff',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column' as const,
  fontFamily: '"Inter", sans-serif',
}

export default function App() {
  const [globalExplosion, setGlobalExplosion] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('button')) return
      setGlobalExplosion({ x: e.clientX, y: e.clientY })
    }

    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  return (
    <div style={containerStyle}>
      <Header />

      <div style={{ position: 'absolute', top: '3rem', right: '2rem', zIndex: 50 }}>
        <ConnectButton />
      </div>

      <main
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1280px',
            display: 'flex',
            gap: '2rem',
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
              minHeight: '580px',
            }}
          >
            <img
              src="/94.webp"
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
              minHeight: '580px',
            }}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '3rem',
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
                padding: '1.5rem',
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
          <h3
            style={{
              color: '#002266',
              marginBottom: '1rem',
              fontWeight: 'bold',
            }}
          >
          </h3>
          <RoundHistoryTable />
        </div>
      </div>

      <Footer />

      {globalExplosion && <Explosion x={globalExplosion.x} y={globalExplosion.y} type="logo" />}
    </div>
  )
}
