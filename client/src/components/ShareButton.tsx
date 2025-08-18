export default function ShareButton() {
  const shareText = encodeURIComponent(
    "Just buzzed the button! ⏱️ Who’s gonna be the last click and take the ETH pot? 👀 Join the game on @FinalClickBase #onchainSummer 👉 https://finalclick.xyz"
  )

  const twitterUrl = `https://x.com/intent/tweet?text=${shareText}`
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
