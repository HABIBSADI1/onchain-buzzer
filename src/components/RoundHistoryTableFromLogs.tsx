import { useEffect, useState } from 'react'
import { formatEther } from 'viem'

type RoundLog = {
  roundId: string
  winner: string
  reward: string
  timestamp: string
  pending?: boolean
}

const PAGE_SIZE = 5
const POLL_INTERVAL = 180_000 // 3 دقیقه

const API_URL =
  import.meta.env.PROD
    ? '/api/rounds'
    : '/api/rounds'

export default function RoundHistoryTableFromLogs() {
  const [rounds, setRounds] = useState<RoundLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)

  const fetchRounds = async () => {
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const contentType = res.headers.get('Content-Type')
      if (!contentType?.includes('application/json')) {
        const html = await res.text()
        console.warn('❌ Expected JSON, got:', html.slice(0, 100))
        throw new Error('Invalid response type')
      }

      const data: RoundLog[] = await res.json()
      setRounds(data)
    } catch (err: any) {
      console.error('❌ Error fetching rounds:', err)
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRounds()

    const interval = setInterval(() => {
      console.log('🔁 Polling /api/rounds...')
      fetchRounds()
    }, POLL_INTERVAL)

    return () => clearInterval(interval)
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
                  <td style={cellStyle}>
                    {r.pending
                      ? '⏳ Pending...'
                      : formatTime(Number(r.timestamp))}
                  </td>
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

// Helpers
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
