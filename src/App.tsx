import { useEffect, useState } from 'react'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import ClickButton from './components/ClickButton'
import CountdownTimer from './components/CountdownTimer'
import GameInfoTable from './components/GameInfoTable'
import RoundHistoryTable from './components/RoundHistoryTable'
import ShareButton from './components/ShareButton'
import Header from './components/Header'
import Footer from './components/Footer'
import Explosion from './components/Explosion'

// ✅ فقط این استایل به کل صفحه اضافه شده
const containerStyle = {
  backgroundColor: '#f7f9ff',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: '"Inter", sans-serif' as const,
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

      {/* دکمه اتصال کیف پول بالا سمت راست */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 50 }}>
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
          {/* ستون چپ - تصویر */}
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

          {/* ستون راست */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '580px',
            }}
          >
            {/* تایمر و دکمه */}
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

            {/* اشتراک‌گذاری */}
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

            {/* اطلاعات بازی */}
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

      {/* جدول راندهای قبلی */}
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
            borderRadius: '12px',
            padding: '1.5rem',
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
            🏆 Round History
          </h3>
          <RoundHistoryTable />
        </div>
      </div>

      <Footer />

      {/* افکت کلیک بدنه - لوگوی Base */}
      {globalExplosion && <Explosion x={globalExplosion.x} y={globalExplosion.y} type="logo" />}
    </div>
  )
}
