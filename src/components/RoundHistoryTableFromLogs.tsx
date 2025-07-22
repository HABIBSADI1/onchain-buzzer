import { useEffect, useState } from 'react'
import { formatEther } from 'viem'

type RoundLog = {
  roundId: string
  winner: string
  reward: string
  timestamp: string
}

const PAGE_SIZE = 5

export default function RoundHistoryTableFromLogs() {
  const [rounds, setRounds] = useState<RoundLog[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch('https://onchain-buzzer-production.up.railway.app/rounds') // 👈 آدرس کامل API
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setRounds(data)
      } catch (err) {
        console.error('❌ Error fetching rounds from API:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
              <td colSpan={4} style={cellStyle}>Loading round logs...</td>
            </tr>
          ) : paginated.length === 0 ? (
            <tr>
              <td colSpan={4} style={cellStyle}>No rounds settled yet.</td>
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

      {!loading && rounds.length > PAGE_SIZE && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={btnStyle}>
            ← Prev
          </button>
          <span style={{ margin: '0 1rem', fontWeight: 'bold' }}>
            Page {page + 1}
          </span>
          <button
            onClick={() =>
              setPage(p => (p + 1) * PAGE_SIZE < rounds.length ? p + 1 : p)
            }
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
