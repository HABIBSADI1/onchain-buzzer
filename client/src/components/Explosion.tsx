import { useEffect } from 'react'

interface ExplosionProps {
  x: number
  y: number
  type: 'emoji' | 'logo'
}

const emojiList = ['🎉', '🚀', '😂', '💥', '🤑', '🔥', '🤯', '🦄']
const logoList = [
  '/_base-square.svg',
  '/base logo3.svg',
  '/base-logo (2).svg',
  '/Base_Network_Logo4.svg',
]

export default function Explosion({ x, y, type }: ExplosionProps) {
  useEffect(() => {
    for (let i = 0; i < 18; i++) {
      const el = document.createElement(type === 'logo' ? 'img' : 'div')

      el.style.position = 'fixed'
      el.style.left = `${x}px`
      el.style.top = `${y}px`
      el.style.pointerEvents = 'none'
      el.style.zIndex = '9999'
      el.style.opacity = '1'
      el.style.transition = 'all 1s ease-out'

      if (type === 'emoji') {
        el.innerHTML = emojiList[Math.floor(Math.random() * emojiList.length)]
        el.style.fontSize = '24px'
      } else {
        const src = logoList[Math.floor(Math.random() * logoList.length)]
        el.setAttribute('src', src)
        el.style.width = '20px'
        el.style.height = '20px'
      }

      const dx = (Math.random() - 0.5) * 150
      const dy = (Math.random() - 0.5) * 150
      const rotate = Math.random() * 720 - 360

      el.animate(
        [
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`, opacity: 0 },
        ],
        { duration: 1000, easing: 'ease-out', fill: 'forwards' }
      )

      document.body.appendChild(el)
      setTimeout(() => el.remove(), 1000)
    }
  }, [x, y, type])

  return null
}
