import { useGameState } from '../hooks/useGameState'
import { formatEther } from 'viem'
import { useAccount } from 'wagmi'
import { isAddress } from 'viem'

export default function GameInfoTable() {
  const { address } = useAccount()
  const { roundId, pot, clickCount, lastPlayer, isLoading } = useGameState()

  if (isLoading) return <div>Loading game info...</div>

  const safeRoundId = typeof roundId === 'bigint' ? roundId.toString() : String(roundId)
  const safeClickCount = typeof clickCount === 'bigint' ? clickCount.toString() : String(clickCount)
  const safePot = pot ? formatEther(pot) : '0'
  const safeLastPlayer = isAddress(lastPlayer) ? lastPlayer : '0x000...0000'

  const isYou =
    address && safeLastPlayer.toLowerCase() === address.toLowerCase()

  return (
    <table style={{
      width: '100%',
      borderCollapse: 'collapse' as const,
      fontSize: '1rem'
    }}>
      <tbody>
        <tr>
          <td style={tdStyle}>🔁 Round:</td>
          <td style={tdStyle}>#{safeRoundId}</td>
        </tr>
        <tr>
          <td style={tdStyle}>💰 Pot:</td>
          <td style={tdStyle}>{safePot} ETH</td>
        </tr>
        <tr>
          <td style={tdStyle}>🔥 Clicks:</td>
          <td style={tdStyle}>{safeClickCount}</td>
        </tr>
        <tr>
          <td style={tdStyle}>🧍 Last Player:</td>
          <td style={tdStyle}>
            {isYou
              ? <span style={{ color: 'green' }}>You</span>
              : `${safeLastPlayer.slice(0, 6)}...${safeLastPlayer.slice(-4)}`}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

const tdStyle: React.CSSProperties = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
}
