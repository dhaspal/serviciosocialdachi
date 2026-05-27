import { useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  type Variants,
} from 'framer-motion'

function cn(...parts: (string | undefined | false)[]) {
  return parts.filter(Boolean).join(' ')
}

export type AngledSliderItem = {
  id: string | number
  url: string
  alt?: string
  title?: string
}

export type AngledSliderProps = {
  items: AngledSliderItem[]
  /** Segundos para un ciclo completo; mayor = más lento. @default 40 */
  speed?: number
  direction?: 'left' | 'right'
  containerHeight?: string
  cardWidth?: string
  gap?: string
  /** Grados de rotación 3D @default 20 */
  angle?: number
  hoverScale?: number
  className?: string
  /** Índice dentro de `items` (no del array duplicado) */
  onItemClick?: (indexInItems: number) => void
}

const cardVariants: Variants = {
  offHover: (angle: number) => ({
    rotateY: angle,
    z: 60,
    opacity: 0.92,
    scale: 1,
    zIndex: 30,
    transition: {
      type: 'spring',
      mass: 3,
      stiffness: 400,
      damping: 50,
    },
  }),
  onHover: (hoverScale: number) => ({
    rotateY: 0,
    z: 120,
    opacity: 1,
    scale: hoverScale,
    zIndex: 50,
    transition: {
      type: 'spring',
      mass: 3,
      stiffness: 400,
      damping: 50,
    },
  }),
}

function AngledCard({
  item,
  angle,
  hoverScale,
  cardWidth,
  sourceIndex,
  onItemClick,
}: {
  item: AngledSliderItem
  angle: number
  hoverScale: number
  cardWidth: string
  sourceIndex: number
  onItemClick?: (index: number) => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="galeria-angled-card-wrap"
      style={{
        width: cardWidth,
        height: '100%',
        transformStyle: 'preserve-3d',
      }}
      custom={isHovered ? hoverScale : angle}
      variants={cardVariants}
      initial="offHover"
      animate={isHovered ? 'onHover' : 'offHover'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        className="galeria-angled-card-face"
        onClick={() => onItemClick?.(sourceIndex)}
        aria-label={item.title ? `Ver: ${item.title}` : 'Ver imagen ampliada'}
      >
        <span className="galeria-angled-card-media">
          <img
            src={item.url}
            alt={item.alt ?? item.title ?? ''}
            className="galeria-angled-card-img"
            draggable={false}
          />
        </span>
        {item.title ? (
          <span className="galeria-angled-card-titlebar">
            <span className="galeria-angled-card-title">{item.title}</span>
          </span>
        ) : null}
      </button>
    </motion.div>
  )
}

export function AngledSlider({
  items,
  speed = 40,
  direction = 'left',
  containerHeight = '400px',
  cardWidth = 'min(72vw, 300px)',
  gap = '40px',
  angle = 20,
  hoverScale = 1.05,
  className,
  onItemClick,
}: AngledSliderProps) {
  const [width, setWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [trackHovered, setTrackHovered] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  const duplicatedItems =
    items.length > 0 ? [...items, ...items, ...items] : []

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const calculateWidth = () => {
      const track = containerRef.current
      const first = track?.querySelector(
        '.galeria-angled-card-wrap',
      ) as HTMLElement | null

      let gapNum = parseInt(
        gap?.toString().replace(/px/gi, '').trim() ?? '40',
        10,
      )
      if (Number.isNaN(gapNum) && track) {
        const g = getComputedStyle(track).gap
        const parsed = parseFloat(g)
        gapNum = Number.isFinite(parsed) ? parsed : 40
      }

      if (first && items.length > 0) {
        const w = first.getBoundingClientRect().width
        if (w > 0) {
          setWidth((w + gapNum) * items.length)
          return
        }
      }

      const wStr = cardWidth?.toString().trim() ?? '300px'
      const numWidth = parseInt(wStr.replace(/px/gi, '').trim(), 10)
      if (!Number.isNaN(numWidth) && !Number.isNaN(gapNum)) {
        setWidth((numWidth + gapNum) * items.length)
      } else if (track && track.scrollWidth > 0) {
        setWidth(track.scrollWidth / 3)
      }
    }

    const id = requestAnimationFrame(() => calculateWidth())
    window.addEventListener('resize', calculateWidth)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', calculateWidth)
    }
  }, [items, cardWidth, gap])

  useEffect(() => {
    if (width <= 0 || reduceMotion || items.length === 0) return

    const startX = direction === 'left' ? 0 : -width
    const endX = direction === 'left' ? -width : 0

    if (trackHovered) return

    const runAnimation = () => {
      const currentX = x.get()
      const totalDist = width
      const dist = Math.abs(endX - currentX)
      const duration = speed * (dist / totalDist)

      const controls = animate(x, endX, {
        duration,
        ease: 'linear',
        onComplete: () => {
          x.set(startX)
          runAnimation()
        },
      })
      return controls
    }

    const animation = runAnimation()

    return () => {
      animation.stop()
    }
  }, [width, speed, direction, trackHovered, reduceMotion, x, items.length])

  if (items.length === 0) return null

  return (
    <div
      className={cn('galeria-angled-root', className)}
      style={{
        height: containerHeight,
        perspective: '1000px',
      }}
      onMouseEnter={() => setTrackHovered(true)}
      onMouseLeave={() => setTrackHovered(false)}
    >
      <motion.div
        ref={containerRef}
        className="galeria-angled-track"
        style={{ x, gap, transformStyle: 'preserve-3d' }}
      >
        {duplicatedItems.map((item, index) => (
          <AngledCard
            key={`${String(item.id)}-${index}`}
            item={item}
            angle={angle}
            hoverScale={hoverScale}
            cardWidth={cardWidth}
            sourceIndex={index % items.length}
            onItemClick={onItemClick}
          />
        ))}
      </motion.div>
    </div>
  )
}
