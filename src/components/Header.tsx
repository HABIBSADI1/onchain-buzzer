export default function Header() {
  return (
    <div
      style={{
        width: '100%',
        background: '#0052FF',
        padding: '0.5rem 0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          color: '#fff',
          whiteSpace: 'nowrap',
          fontSize: '1rem',
          fontWeight: 'bold',
          animation: 'scrollText 15s linear infinite',
        }}
      >
        🎉 Join the Onchain Buzzer Game on Base – Last click wins the pot! 💰 Play now, win big! 🚀 #onchainSummer #base
      </div>

      {/* Keyframes CSS */}
      <style>
        {`
          @keyframes scrollText {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </div>
  )
}
