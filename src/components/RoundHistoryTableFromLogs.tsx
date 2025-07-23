import { useEffect, useState } from 'react'
import { formatEther } from 'viem'

// ✅ تعریف نوع داده‌ها
type RoundLog = {
  roundId: string
  winner: string
  reward: string
  timestamp: string
}

// ✅ تنظیمات API
const PAGE_SIZE = 5
const API_URL = 'https://onchain-buzzer-production.up.railway.app/rounds'

export default function RoundHistoryTableFromLogs() {
  const [rounds, setRounds] = useState<RoundLog[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  // ✅ واکشی دیتا از API
  useEffect(() => {
    const fetchRounds = async () => {
      try {
        console.log('📡 Fetching from:', API_URL)
        setLoading(true)

        const res = await fetch(API_URL)

        const contentType = res.headers.get('Content-Type')
        if (!res.ok) throw new Error(`❌ HTTP error: ${res.status}`)
        if (!contentType?.includes('application/json')) {
          throw new Error(`❌ Invalid Content-Type: ${contentType}`)
        }

        const data = await res.json()
        if (!Array.isArray(data)) throw new Error('❌ API did not return array')

        setRounds(data)
      } catch (error) {
        console.error('❌ Failed to fetch round history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRounds()
  }, [])

  // ✅ صفحه‌بندی
  const paginated = rounds.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div>
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
          {loading ? (
            <tr>
              <td colSpan={4} style={cellStyle}>Loading...</td>
            </tr>
          ) : paginated.length === 0 ? (
            <tr>
              <td colSpan={4} style={cellStyle}>No rounds available.</td>
            </tr>
          ) : (
            paginated.map((r, i) => (
              <tr key={i}>
                <td style={cellStyle}>#{r.roundId}</td>
                <td style={cellStyle}>{shorten(r.winner)}</td>
                <td style={cellStyle}>{formatEther(BigInt(r.reward))} ETH</td>
                <td style={cellStyle}>{formatTime(Number(r.timestamp))}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ✅ دکمه‌های صفحه‌بندی */}
      {!loading && rounds.length > PAGE_SIZE && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={btnStyle}>
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
    </div>
  )
}

// ✅ Helpers
const shorten = (addr: string) => addr.slice(0, 6) + '...' + addr.slice(-4)

const formatTime = (ts: number) =>
  new Date(ts * 1000).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

// ✅ Styles
const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.92rem',
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
}
