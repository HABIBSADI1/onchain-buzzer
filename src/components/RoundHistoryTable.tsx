import { useContractRead } from 'wagmi'
import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'

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

export default function RoundHistoryTable() {
  const { data: totalRounds, isLoading } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'totalRounds',
  })

  const total = totalRounds ? BigNumber.from(totalRounds).toNumber() : 0
  const rounds = total > 0
    ? Array.from({ length: Math.min(total, 5) }, (_, i) => total - 1 - i)
    : []

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
        {isLoading ? (
          <tr><td colSpan={4} style={loadingCell}>Loading rounds...</td></tr>
        ) : rounds.length === 0 ? (
          <tr><td colSpan={4} style={loadingCell}>No rounds yet</td></tr>
        ) : (
          rounds.map((id) => <HistoryRow key={id} id={id} />)
        )}
      </tbody>
    </table>
  )
}

function HistoryRow({ id }: { id: number }) {
  const { data, isError, isLoading } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'history',
    args: [BigNumber.from(id)],
    enabled: id >= 0,
  })

  if (isLoading) {
    return <tr><td colSpan={4} style={loadingCell}>Loading...</td></tr>
  }

  if (isError || !data) {
    return (
      <tr>
        <td colSpan={4} style={{ ...cellStyle, color: 'red' }}>
          ❌ Error loading round #{id}
        </td>
      </tr>
    )
  }

  try {
    const { roundId, winner, reward, timestamp } = data as {
      roundId: BigNumber
      winner: string
      reward: BigNumber
      timestamp: BigNumber
    }

    return (
      <tr>
        <td style={cellStyle}>#{roundId.toString()}</td>
        <td style={cellStyle}>{`${winner.slice(0, 6)}...${winner.slice(-4)}`}</td>
        <td style={cellStyle}>{formatEther(reward)}</td>
        <td style={cellStyle}>
          {new Date(timestamp.toNumber() * 1000).toLocaleString()}
        </td>
      </tr>
    )
  } catch (err) {
    return (
      <tr>
        <td colSpan={4} style={{ ...cellStyle, color: 'orange' }}>
          ⚠️ Invalid round data
        </td>
      </tr>
    )
  }
}

// styles
const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.92rem',
  fontFamily: 'Inter, sans-serif',
}

const headerRowStyle: React.CSSProperties = {
  backgroundColor: '#eef2ff',
}

const cellStyle: React.CSSProperties = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
  textAlign: 'center',
}

const loadingCell: React.CSSProperties = {
  ...cellStyle,
  fontStyle: 'italic',
  color: '#888',
}
