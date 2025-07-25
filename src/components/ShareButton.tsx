export default function ShareButton() {
  const shareText = encodeURIComponent(
    "🔥 I just buzzed in the Onchain Buzzer Game on @BuildOnBase! Try your luck before the timer runs out! https://yourapp.com #onchainSummer #base"
  )

  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}`
  const farcasterUrl = `https://warpcast.com/~/compose?text=${shareText}`

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={buttonStyle}
      >
         Share on X
      </a>
      <a
        href={farcasterUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={buttonStyle}
      >
         Share on Farcaster
      </a>
    </div>
  )
}

const buttonStyle: React.CSSProperties = {
  background: '#6975aaff',
  color: '#fff',
  padding: '0.6rem 1rem',
  fontWeight: 'bold',
  borderRadius: '8px',
  textDecoration: 'none',
  boxShadow: '0 0 10px #0052FF88',
  fontSize: '0.9rem'
}
