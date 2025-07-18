import { useContractRead } from 'wagmi'
import { formatEther } from 'viem'
import { useContractRead as useRead } from 'wagmi'

const CONTRACT_ADDRESS = '0xFf2b0FA2ccd7Fa8f872c902628a1217C1B8fc1a3'

const abi = [
  {
    name: 'history',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'roundId', type: 'uint256' },
      { name: 'winner', type: 'address' },
      { name: 'reward', type: 'uint256' },
      { name: 'timestamp', type: 'uint256' },
    ],
  },
  {
    name: 'totalRounds',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

// 🟦 کامپوننت اصلی جدول
export default function RoundHistoryTable() {
  const { data: totalRounds } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'totalRounds',
    watch: true,
  })

  const rounds = Array.from({ length: Number(totalRounds || 0) }, (_, i) => Number(totalRounds) - 1 - i)

  return (
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
        {rounds.map((id) => (
          <HistoryRow key={id} id={id} />
        ))}
      </tbody>
    </table>
  )
}

// 🟦 ردیف هر راند
function HistoryRow({ id }: { id: number }) {
  const { data, isLoading, isError } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'history',
    args: [BigInt(id)],
  })

  if (isLoading) {
    return (
      <tr>
        <td style={loadingCell} colSpan={4}>Loading...</td>
      </tr>
    )
  }

  if (
    isError ||
    !data ||
    typeof data !== 'object' ||
    !('winner' in data) ||
    !('roundId' in data) ||
    !('reward' in data) ||
    !('timestamp' in data)
  ) {
    return (
      <tr>
        <td colSpan={4} style={{ ...cellStyle, color: 'red' }}>
          ❌ Error loading round #{id}
        </td>
      </tr>
    )
  }

  const { roundId, winner, reward, timestamp } = data as {
    roundId: bigint
    winner: string
    reward: bigint
    timestamp: bigint
  }

  return (
    <tr>
      <td style={cellStyle}>#{roundId.toString()}</td>
      <td style={cellStyle}>{`${winner.slice(0, 6)}...${winner.slice(-4)}`}</td>
      <td style={cellStyle}>{formatEther(reward)}</td>
      <td style={cellStyle}>{new Date(Number(timestamp) * 1000).toLocaleString()}</td>
    </tr>
  )
}

// 🟦 استایل‌ها
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.92rem',
  fontFamily: 'Inter, sans-serif',
}

const headerRowStyle = {
  backgroundColor: '#eef2ff',
}

const cellStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
  textAlign: 'center' as const,
}

const loadingCell = {
  ...cellStyle,
  fontStyle: 'italic',
  color: '#888',
}
