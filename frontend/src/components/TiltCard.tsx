import { useRef, useState, type MouseEvent, type ReactNode } from 'react'
import './TiltCard.css'

type Props = {
  children: ReactNode
  className?: string
}

export function TiltCard({ children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState(
    'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
  )
  const [glow, setGlow] = useState({ x: 50, y: 50 })

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const element = ref.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -10
    const rotateY = ((x - centerX) / centerX) * 10

    setTransform(
      `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`,
    )
    setGlow({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    })
  }

  const handleLeave = () => {
    setTransform(
      'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    )
    setGlow({ x: 50, y: 50 })
  }

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`.trim()}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform,
        ['--tilt-glow-x' as string]: `${glow.x}%`,
        ['--tilt-glow-y' as string]: `${glow.y}%`,
      }}
    >
      <div className="tilt-card__inner">{children}</div>
    </div>
  )
}
