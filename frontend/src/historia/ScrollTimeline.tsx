import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { SyntheticEvent } from 'react'
import { LOGO_INSTITUCIONAL } from '../brand/logo'
import { INSTITUTION_FULL_NAME } from '../brand/institutionName'
import './ScrollTimeline.css'

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export type ScrollTimelineEvent = {
  year: string
  title: string
  subtitle?: string
  description: string
}

type Props = {
  events: ScrollTimelineEvent[]
  title?: string
  subtitle?: string
  /** Imagen decorativa (logo institucional por defecto) */
  visualSrc?: string
  visualAlt?: string
  /** Texto del panel lateral (desktop ancho) */
  visualTitle?: string
  visualParagraphs?: string[]
  className?: string
}

export function ScrollTimeline({
  events,
  title = 'Línea de tiempo',
  subtitle = '',
  visualSrc = LOGO_INSTITUCIONAL,
  visualAlt = 'Identidad institucional',
  visualTitle = INSTITUTION_FULL_NAME,
  visualParagraphs = [
    'Cada hito cuenta cómo la comunidad Emberá Katío del resguardo Gito Dokabú construyó paso a paso su propia institución educativa, articulando ley de origen, territorio y escolarización.',
    `Esta línea de tiempo resume el camino desde las asambleas de 2013 hasta la consolidación de sedes y el nombre oficial como ${INSTITUTION_FULL_NAME}.`,
    'Desplázate para iluminar el recorrido: el resplandor acompaña el avance por la memoria colectiva del pueblo.',
  ],
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const cometRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const visualRef = useRef<HTMLDivElement>(null)
  const visualImgRef = useRef<HTMLImageElement>(null)
  const lastScrollY = useRef(0)
  const scrollDirection = useRef<'down' | 'up'>('down')
  const activeIndexRef = useRef(-1)
  const [imgSrc, setImgSrc] = useState(visualSrc)

  useEffect(() => {
    setImgSrc(visualSrc)
  }, [visualSrc])

  const onImgError = (_e: SyntheticEvent<HTMLImageElement>) => {
    setImgSrc('/favicon.svg')
  }

  const onScroll = useCallback(() => {
    const el = containerRef.current
    if (!el || !progressRef.current || !cometRef.current) return

    const currentScrollY = window.scrollY
    if (currentScrollY > lastScrollY.current) scrollDirection.current = 'down'
    else if (currentScrollY < lastScrollY.current) scrollDirection.current = 'up'
    lastScrollY.current = currentScrollY

    const rect = el.getBoundingClientRect()
    const total = rect.height
    const startOffset = window.innerHeight * 0.5
    const raw =
      (window.innerHeight - rect.top - startOffset) /
      (total + window.innerHeight - startOffset)
    const clamped = Math.max(0, Math.min(1, raw))
    const eased = Math.pow(clamped, 0.85)
    progressRef.current.style.height = `${eased * 100}%`
    cometRef.current.style.top = `${eased * 100}%`

    const newIndex = Math.floor(eased * events.length)
    if (
      newIndex !== activeIndexRef.current &&
      newIndex >= 0 &&
      newIndex < events.length
    ) {
      activeIndexRef.current = newIndex
      setActiveIndex(newIndex)
    }

    cardRefs.current.forEach((card) => {
      if (!card) return
      const r = card.getBoundingClientRect()
      const trigger = window.innerHeight * 0.5
      if (r.top < trigger) card.classList.add('hist-st-card--visible')
      else card.classList.remove('hist-st-card--visible')
    })

    const vr = visualRef.current
    if (vr) {
      const visualRect = vr.getBoundingClientRect()
      const screenCenter = window.innerHeight * 0.5
      const elementCenter = visualRect.top + visualRect.height * 0.5
      const isInCenter =
        elementCenter >= screenCenter * 0.8 &&
        elementCenter <= screenCenter * 1.2

      if (scrollDirection.current === 'down' && isInCenter) {
        vr.classList.add('hist-st-visual--on')
      } else if (scrollDirection.current === 'up' && !isInCenter) {
        vr.classList.remove('hist-st-visual--on')
      }
    }
  }, [events.length])

  useEffect(() => {
    activeIndexRef.current = -1
    setActiveIndex(-1)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [onScroll])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const vr = visualRef.current
      const img = visualImgRef.current
      if (!vr || !img) return
      const rect = vr.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const cx = rect.width / 2
      const cy = rect.height / 2
      const tx = ((x - cx) / cx) * 10
      const ty = ((y - cy) / cy) * 10
      img.style.transform = `translate(${tx}px, ${ty}px)`
    }

    const onMouseLeave = () => {
      if (visualImgRef.current) visualImgRef.current.style.transform = ''
    }

    const vr = visualRef.current
    if (vr) {
      vr.addEventListener('mousemove', onMouseMove)
      vr.addEventListener('mouseleave', onMouseLeave)
    }
    return () => {
      if (vr) {
        vr.removeEventListener('mousemove', onMouseMove)
        vr.removeEventListener('mouseleave', onMouseLeave)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn('hist-st-root', className)}
    >
      <div className="hist-st-title">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <div className="hist-st-wrap">
        <div className="hist-st-line" aria-hidden="true" />
        <div ref={progressRef} className="hist-st-progress" aria-hidden="true" />
        <div ref={cometRef} className="hist-st-comet" aria-hidden="true" />
        <div className="hist-st-visual-text">
          <div className="hist-st-visual-box">
            <h3>{visualTitle}</h3>
            {visualParagraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>
        <div className="hist-st-visual" ref={visualRef}>
          <img
            ref={visualImgRef}
            src={imgSrc}
            alt={visualAlt}
            onError={onImgError}
          />
        </div>
        {events.map((e, i) => (
          <div
            key={`${e.year}-${e.title}-${i}`}
            className={cn('hist-st-row', i % 2 === 1 ? 'hist-st-row--rev' : '')}
          >
            <div
              className={cn(
                'hist-st-node',
                i <= activeIndex ? 'hist-st-node--active' : '',
              )}
              aria-hidden="true"
            />
            <div
              className="hist-st-card"
              ref={(el) => {
                cardRefs.current[i] = el
              }}
            >
              <p className="hist-st-year">{e.year}</p>
              <h3 className="hist-st-card-title">{e.title}</h3>
              {e.subtitle ? <p className="hist-st-sub">{e.subtitle}</p> : null}
              <p className="hist-st-desc">{e.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
