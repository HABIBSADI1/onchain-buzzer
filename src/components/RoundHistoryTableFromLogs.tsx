import { useEffect, useState } from 'react'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import abi from '../abi.json'
import { formatEther } from 'viem'

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`
const RPC_URL = import.meta.env.VITE_RPC_URL!

type RoundLog = {
  roundId: bigint
  winner: `0x${string}`
  reward: bigint
  timestamp: bigint
}

const BLOCK_STEP = 500n
const PAGE_SIZE = 5

export default function RoundHistoryTableFromLogs() {
  const [rounds, setRounds] = useState<RoundLog[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)

        const client = createPublicClient({
          chain: base,
          transport: http(RPC_URL),
        })

        const latestBlock = await client.getBlockNumber()
        let allLogs: RoundLog[] = []

        // حرکت از بلاک پایین به بالا در محدوده‌های 500تایی
        for (
          let fromBlock = 0n;
          fromBlock <= latestBlock && allLogs.length < PAGE_SIZE * 5;
          fromBlock += BLOCK_STEP
        ) {
          const toBlock = fromBlock + BLOCK_STEP < latestBlock ? fromBlock + BLOCK_STEP : latestBlock

          const logs = await client.getLogs({
            address: CONTRACT_ADDRESS,
            abi,
            eventName: 'RoundSettled',
            fromBlock,
            toBlock,
          })

          const parsed = logs.map(log => log.args as RoundLog)
          allLogs = [...parsed, ...allLogs]

          if (allLogs.length >= PAGE_SIZE * 5) break
        }

        allLogs.sort((a, b) => Number(b.roundId - a.roundId))
        setRounds(allLogs)
      } catch (err) {
        console.error('❌ Error fetching logs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
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
                <td style={cellStyle}>#{r.roundId.toString()}</td>
                <td style={cellStyle}>{shorten(r.winner)}</td>
                <td style={cellStyle}>{formatEther(r.reward)} ETH</td>
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
