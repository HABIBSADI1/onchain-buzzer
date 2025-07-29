export default function Footer() {
  return (
    <footer
      style={{
        width: '100%',
        background: '#f0f4ff',
        textAlign: 'center',
        padding: '1rem 0',
        marginTop: '2rem',
        borderTop: '1px solid #dce3f5',
      }}
    >
      <p style={{ margin: 0, fontSize: '0.9rem' }}>
        🚀 Built on <strong>Base</strong> by <a href="https://warpcast.com/0x369" target="_blank" rel="noreferrer">habibsadi.eth</a>
      </p>
      <div style={{ marginTop: '0.5rem' }}>
        <a href="https://twitter.com/FinalClickBase" target="_blank" rel="noreferrer" style={linkStyle}> Twitter (x) </a>{' | '}
        <a href="https://warpcast.com/0x369" target="_blank" rel="noreferrer" style={linkStyle}>🟪 Farcaster</a>
      </div>
    </footer>
  )
}

const linkStyle: React.CSSProperties = {
  color: '#0052FF',
  textDecoration: 'none',
  fontWeight: 'bold'
}
