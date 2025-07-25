import { useEffect, useState } from 'react'
import { formatEther } from 'viem'

type RoundLog = {
  roundId: string
  winner: string
  reward: string
  timestamp: string
}

const PAGE_SIZE = 5

// 🔥 API آدرس درست‌شده برای production و local
const API_URL =
  import.meta.env.PROD
    ? '/rounds' // توی Railway دیپلوی کامل fullstack
    : 'http://localhost:3000/rounds' // فقط برای dev پراکسی

export default function RoundHistoryTableFromLogs() {
  const [rounds, setRounds] = useState<RoundLog[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        console.log('📡 Fetching rounds from backend:', API_URL)

        const res = await fetch(API_URL)
        const contentType = res.headers.get('Content-Type')

        if (!res.ok) {
          throw new Error(`HTTP error! Status ${res.status}`)
        }

        if (!contentType?.includes('application/json')) {
          const htmlText = await res.text()
          console.warn('❌ Expected JSON but got HTML:', htmlText.slice(0, 100))
          throw new Error('Expected JSON but got something else')
        }

        const data = await res.json()
        if (!Array.isArray(data)) throw new Error('Invalid data structure')
        console.log('✅ Rounds received:', data)

        setRounds(data)
      } catch (err: any) {
        console.error('❌ Failed to load rounds:', err)
        setError(err.message || 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchRounds()
  }, [])

  const paginated = rounds.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>🏆 Round History</h2>

      {loading ? (
        <p style={{ textAlign: 'center' }}>⏳ Loading...</p>
      ) : error ? (
        <p style={{ color: 'red', textAlign: 'center' }}>❌ {error}</p>
      ) : rounds.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No rounds found.</p>
      ) : (
        <>
          <table style={tableStyle}>
            <thead>
              <tr style={headerRowStyle}>
                <th style={cellStyle}>Round</th>
                <th style={cellStyle}>Winner</th>
                <th style={cellStyle}>Reward (ETH)</th>
                <th style={cellStyle}>Time</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r, i) => (
                <tr key={i}>
                  <td style={cellStyle}>#{r.roundId}</td>
                  <td style={cellStyle}>{shorten(r.winner)}</td>
                  <td style={cellStyle}>{formatEther(BigInt(r.reward))}</td>
                  <td style={cellStyle}>{formatTime(Number(r.timestamp))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {rounds.length > PAGE_SIZE && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                style={btnStyle}
              >
                ← Prev
              </button>
              <span style={{ margin: '0 1rem', fontWeight: 'bold' }}>
                Page {page + 1}
              </span>
              <button
                onClick={() => setPage(p => (p + 1) * PAGE_SIZE < rounds.length ? p + 1 : p)}
                disabled={(page + 1) * PAGE_SIZE >= rounds.length}
                style={btnStyle}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const shorten = (addr: string) => addr.slice(0, 6) + '...' + addr.slice(-4)

const formatTime = (ts: number) =>
  new Date(ts * 1000).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.92rem',
  boxShadow: '0 0 5px rgba(0,0,0,0.1)',
}

const headerRowStyle: React.CSSProperties = {
  backgroundColor: '#eef2ff',
}

const cellStyle: React.CSSProperties = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
  textAlign: 'center',
}

const btnStyle: React.CSSProperties = {
  background: '#0052FF',
  color: '#fff',
  padding: '6px 14px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  margin: '0 5px',
}
