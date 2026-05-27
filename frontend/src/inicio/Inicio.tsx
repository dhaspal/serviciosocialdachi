import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { TiltCard } from '../components/TiltCard'
import { BLOG_POSTS } from '../blog/data'
import type { SectionId } from '../sections/types'
import { INSTITUTION_FULL_NAME } from '../brand/institutionName'
import {
  HOME_BENTO_TILES,
  HOME_PARALLAX_BG,
  HOME_SPOT_CHIPS,
  HOME_STATS,
  HOME_TRACKS,
  SLIDES,
} from './data'
import './Inicio.css'

const SLIDE_MS = 7000

type Props = {
  onNavigate: (id: SectionId) => void
}

/** Caracteres con animación tipo ola (accesible: el grupo usa aria-label). */
function WaveChars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text, (ch, i) => (
        <span
          key={i}
          className="home-wave-char"
          style={{ animationDelay: `${i * 0.055}s` }}
        >
          {ch === ' ' ? '\u00a0' : ch}
        </span>
      ))}
    </>
  )
}

export function Inicio({ onNavigate }: Props) {
  const [index, setIndex] = useState(0)
  const homeRootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = homeRootRef.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('.home-reveal'))
    if (nodes.length === 0) return

    const showAll = () => {
      nodes.forEach((el) => el.classList.add('home-reveal--visible'))
    }

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      showAll()
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          el.classList.add('home-reveal--visible')
          io.unobserve(el)
        }
      },
      {
        root: null,
        /* Margen positivo: cuenta como visible un poco antes (evita que queden en opacity:0). */
        rootMargin: '10% 0px 18% 0px',
        threshold: [0, 0.01, 0.05],
      },
    )

    const flush = () => {
      for (const entry of io.takeRecords()) {
        if (!entry.isIntersecting) continue
        const el = entry.target as HTMLElement
        el.classList.add('home-reveal--visible')
        io.unobserve(el)
      }
    }

    nodes.forEach((el) => io.observe(el))
    flush()
    requestAnimationFrame(flush)
    requestAnimationFrame(() => requestAnimationFrame(flush))

    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length)
    }, SLIDE_MS)
    return () => window.clearInterval(t)
  }, [])

  const goSlidePrev = () =>
    setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)
  const goSlideNext = () => setIndex((i) => (i + 1) % SLIDES.length)

  const slide = SLIDES[index]
  const news = [...BLOG_POSTS]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  const mission = HOME_BENTO_TILES.find((t) => t.role === 'mission')
  const restTiles = HOME_BENTO_TILES.filter((t) => t.role !== 'mission')
  const bentoTiles = mission ? [mission, ...restTiles] : restTiles

  return (
    <div className="home" ref={homeRootRef}>
      <div className="home-parallax" aria-hidden="true">
        <div
          className="home-parallax__layer home-parallax__layer--img"
          style={{
            backgroundImage: `linear-gradient(
              180deg,
              rgba(255, 253, 248, 0.72) 0%,
              rgba(255, 248, 240, 0.38) 38%,
              rgba(255, 253, 248, 0.68) 100%
            ), url(${HOME_PARALLAX_BG})`,
          }}
        />
      </div>

      <div className="home-foreground">
      <section
        className="home-slider"
        aria-roledescription="carrusel"
        aria-label="Banner principal"
      >
        <button
          type="button"
          className="home-slider-arrow home-slider-arrow--prev"
          onClick={goSlidePrev}
          aria-label="Diapositiva anterior"
        >
          <svg className="home-slider-arrow-icon" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="currentColor"
              d="M15.41 16.59L14 18l-6-6 6-6 1.41-1.41L10.83 12z"
            />
          </svg>
        </button>
        <button
          type="button"
          className="home-slider-arrow home-slider-arrow--next"
          onClick={goSlideNext}
          aria-label="Diapositiva siguiente"
        >
          <svg className="home-slider-arrow-icon" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="currentColor"
              d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
            />
          </svg>
        </button>
        <div
          key={slide.id}
          className="home-slider-slide home-slider-slide--photo"
          style={{
            backgroundImage: `${slide.overlay}, url(${slide.photoUrl})`,
          }}
        >
          <div className="home-slider-inner layout-contained">
            <p className="home-slider-kicker home-slider-kicker--nombre-inst">
              {INSTITUTION_FULL_NAME}
            </p>
            <h1 className="home-slider-title">{slide.title}</h1>
            <p className="home-slider-sub">{slide.subtitle}</p>
            <div className="home-slider-actions">
              <button
                type="button"
                className="home-slider-cta"
                onClick={() => onNavigate(slide.target)}
              >
                {slide.ctaLabel}
              </button>
              <button
                type="button"
                className="home-slider-ghost"
                onClick={() => onNavigate('ubicacion')}
              >
                Ubicación y contacto
              </button>
            </div>
          </div>
        </div>
        <div className="home-slider-dots" role="tablist" aria-label="Seleccionar diapositiva">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={
                i === index
                  ? 'home-slider-dot home-slider-dot--active'
                  : 'home-slider-dot'
              }
              onClick={() => setIndex(i)}
              aria-label={`Diapositiva ${i + 1} de ${SLIDES.length}`}
            />
          ))}
        </div>
      </section>

      <section className="home-spot layout-contained" aria-labelledby="home-spot-title">
        <div className="home-spot-head home-reveal">
          <h2 id="home-spot-title" className="home-section-title home-section-title--flush">
            La institución en un vistazo
          </h2>
          <p className="home-spot-lead">
            Datos y líneas de trabajo que organizan nuestra labor diaria con estudiantes,
            familias y comunidad.
          </p>
        </div>
        <ul className="home-spot-chips">
          {HOME_SPOT_CHIPS.map((c) => (
            <li key={c.id}>
              <article
                className={`home-spot-chip home-spot-chip--${c.accent} home-reveal`}
              >
                <h3 className="home-spot-chip-title">{c.label}</h3>
                <p className="home-spot-chip-hint">{c.hint}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-bento-wrap layout-contained" aria-labelledby="home-bento-title">
        <h2 id="home-bento-title" className="home-section-title home-reveal">
          Quiénes somos y cómo trabajamos
        </h2>
        <div className="home-bento">
          {bentoTiles.map((tile, idx) => (
            <TiltCard
              key={tile.id}
              className={[
                'home-bento-tile-wrap',
                idx === 4 ? 'home-bento-tile-wrap--centered-below' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <article
                className={[
                  'home-bento-tile home-reveal',
                  tile.role === 'mission' ? 'home-bento-tile--mission' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <h3 className="home-bento-tile-title">{tile.title}</h3>
                <p className="home-bento-tile-body">{tile.body}</p>
                {tile.foot ? (
                  <p className="home-bento-tile-foot">{tile.foot}</p>
                ) : null}
              </article>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="home-quick layout-contained" aria-labelledby="home-quick-title">
        <h2 id="home-quick-title" className="home-section-title home-reveal">
          Acceso rápido
        </h2>
        <div className="home-quick-grid">
          <button
            type="button"
            className="home-quick-card home-quick-card--blog home-reveal"
            onClick={() => onNavigate('blog')}
          >
            <span className="home-quick-label">Blog</span>
            <span className="home-quick-hint">Noticias y comunicados</span>
          </button>
          <button
            type="button"
            className="home-quick-card home-quick-card--ubi home-reveal"
            onClick={() => onNavigate('ubicacion')}
          >
            <span className="home-quick-label">Ubicación</span>
            <span className="home-quick-hint">Mapa y datos de contacto</span>
          </button>
          <button
            type="button"
            className="home-quick-card home-quick-card--cat home-reveal"
            onClick={() => onNavigate('catalogo')}
          >
            <span className="home-quick-label">Catálogo</span>
            <span className="home-quick-hint">Productos y servicios</span>
          </button>
        </div>
      </section>

      <section className="home-tracks layout-contained" aria-labelledby="home-tracks-title">
        <h2 id="home-tracks-title" className="home-section-title home-reveal">
          Oferta formativa y proyectos
        </h2>
        <div className="home-tracks-grid">
          {HOME_TRACKS.map((tr) => (
            <article key={tr.id} className="home-track-card home-reveal">
              <ul className="home-track-tags">
                {tr.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <h3 className="home-track-title">{tr.name}</h3>
              <p className="home-track-summary">{tr.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-stats" aria-label="Indicadores institucionales">
        <div className="layout-contained home-stats-inner">
          <p className="home-stats-kicker home-reveal">Cifras que nos representan</p>
          <div className="home-stats-row">
            {HOME_STATS.map((s) => (
              <div
                key={s.id}
                className="home-stat home-stat--card home-reveal"
                role="group"
                aria-label={s.ariaLabel}
              >
                <span className="home-stat-n" aria-hidden="true">
                  <WaveChars text={s.value} />
                </span>
                <span className="home-stat-l" aria-hidden="true">
                  <WaveChars text={s.label} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-news layout-contained" aria-labelledby="home-news-title">
        <div className="home-news-head home-reveal">
          <h2 id="home-news-title" className="home-section-title">
            Últimas noticias
          </h2>
          <button
            type="button"
            className="home-news-all"
            onClick={() => onNavigate('blog')}
          >
            Ver todas
          </button>
        </div>
        <div className="home-news-grid">
          {news.map((p) => (
            <article key={p.id} className="home-news-card home-reveal">
              <p className="home-news-meta">
                {p.date} · {p.category}
              </p>
              <h3 className="home-news-title">{p.title}</h3>
              <p className="home-news-excerpt">{p.excerpt}</p>
              <button
                type="button"
                className="home-news-link"
                onClick={() => onNavigate('blog')}
              >
                Leer en el blog
              </button>
            </article>
          ))}
        </div>
      </section>
      </div>
    </div>
  )
}
