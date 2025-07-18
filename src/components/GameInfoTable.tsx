import { useGameState } from '../hooks/useGameState'
import { formatEther } from 'viem'
import { useAccount } from 'wagmi'

export default function GameInfoTable() {
  const { address } = useAccount()
  const { roundId, pot, clickCount, lastPlayer, isLoading } = useGameState()

  if (isLoading) return <div>Loading game info...</div>

  return (
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '1rem'
    }}>
      <tbody>
        <tr>
          <td style={tdStyle}>🔁 Round:</td>
          <td style={tdStyle}>#{roundId}</td>
        </tr>
        <tr>
          <td style={tdStyle}>💰 Pot:</td>
          <td style={tdStyle}>{formatEther(pot)} ETH</td>
        </tr>
        <tr>
          <td style={tdStyle}>🔥 Clicks:</td>
          <td style={tdStyle}>{clickCount}</td>
        </tr>
        <tr>
          <td style={tdStyle}>🧍 Last Player:</td>
          <td style={tdStyle}>
            {lastPlayer.toLowerCase() === address?.toLowerCase()
              ? <span style={{ color: 'green' }}>You</span>
              : `${lastPlayer.slice(0, 6)}...${lastPlayer.slice(-4)}`}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
}
