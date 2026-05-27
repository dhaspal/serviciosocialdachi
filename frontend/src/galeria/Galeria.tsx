import { useEffect, useMemo, useState } from 'react'
import { AngledSlider } from './AngledSlider'
import { createPortal, flushSync } from 'react-dom'
import { useAdminAuth } from '../admin/AdminAuthContext'
import '../admin/AdminManage.css'
import type { ApiAlbumGaleria, ApiItemGaleria } from '../api/types'
import { getAlbumes, getItems } from '../api/galeriaApi'
import { GaleriaAdminPanel } from './GaleriaAdminPanel'
import {
  normalizeGaleriaAlbumKey,
  resolveGalleryImageUrl,
  type GaleriaAlbum,
  type GaleriaFoto,
} from './data'
import {
  normalizeAlbumesGaleriaResponse,
  normalizeItemsGaleriaResponse,
} from './normalizeGaleriaApi'
import './Galeria.css'

const FALLBACK_GRADIENT =
  'linear-gradient(135deg,#E8553E,#C63D28)' as const

type LightboxState = {
  slideIndex: number
} | null

/** Vista previa por álbum: 3 fotos en pantallas anchas, 1 en móvil. */
function usePorTituloPreviewLimit() {
  const [limit, setLimit] = useState<1 | 3>(3)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const sync = () => setLimit(mq.matches ? 1 : 3)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return limit
}

function buildAlbumsFromApi(
  albumes: ApiAlbumGaleria[],
  items: ApiItemGaleria[],
): GaleriaAlbum[] {
  const byAlbum = new Map<string, ApiItemGaleria[]>()
  for (const it of items) {
    const keyRaw = it.album?.trim()
    if (!keyRaw) continue
    const url = resolveGalleryImageUrl(it.url_imagen?.trim())
    if (!url) continue
    const key = normalizeGaleriaAlbumKey(keyRaw)
    const list = byAlbum.get(key) ?? []
    list.push(it)
    byAlbum.set(key, list)
  }

  return [...albumes]
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
    .map((al) => {
      const rows = (byAlbum.get(normalizeGaleriaAlbumKey(al.nombre)) ?? []).sort(
        (x, y) => x.orden - y.orden,
      )
      return {
        id: al.id,
        name: al.nombre,
        date: '—',
        description:
          al.descripcion?.trim() || 'Álbum de la galería institucional.',
        photos: rows.map((it) => ({
          id: it.id,
          title: it.titulo,
          gradient: FALLBACK_GRADIENT,
          imageUrl: resolveGalleryImageUrl(it.url_imagen.trim()),
        })),
      }
    })
    .filter((al) => al.photos.length > 0)
}

export function Galeria() {
  const { isAuthenticated, token, logout } = useAdminAuth()
  const [albums, setAlbums] = useState<GaleriaAlbum[]>([])
  const [albumId, setAlbumId] = useState('')
  const [loadPhase, setLoadPhase] = useState<'loading' | 'ready'>('loading')
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [apiSynced, setApiSynced] = useState(false)

  const [lightbox, setLightbox] = useState<LightboxState>(null)
  const porTituloPreviewLimit = usePorTituloPreviewLimit()
  const [porTituloExpandido, setPorTituloExpandido] = useState<
    Record<string, boolean>
  >({})

  useEffect(() => {
    let cancelled = false
    void (async () => {
      setLoadPhase('loading')
      setFetchError(null)
      try {
        const [albumesRaw, itemsRaw] = await Promise.all([
          getAlbumes({ limit: 400 }),
          getItems({ limit: 1200 }),
        ])
        if (cancelled) return
        const albumes = normalizeAlbumesGaleriaResponse(albumesRaw as unknown)
        const items = normalizeItemsGaleriaResponse(itemsRaw as unknown)
        const built = buildAlbumsFromApi(albumes, items)
        setAlbums(built)
        setApiSynced(true)
        if (built.length > 0) {
          setAlbumId((prev) =>
            prev && built.some((a) => a.id === prev) ? prev : built[0]!.id,
          )
        } else {
          setAlbumId('')
        }
      } catch {
        if (!cancelled) {
          setAlbums([])
          setAlbumId('')
          setApiSynced(false)
          setFetchError(
            'No se pudo cargar la galería. Verificá la conexión o intentá más tarde.',
          )
        }
      } finally {
        if (!cancelled) setLoadPhase('ready')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const album = useMemo(
    () =>
      albums.length === 0
        ? undefined
        : (albums.find((a) => a.id === albumId) ?? albums[0]),
    [albumId, albums],
  )

  const photos = album?.photos ?? []

  const { angledSliderItems, angledSliderMeta } = useMemo(() => {
    const items: {
      id: string
      url: string
      alt: string
      title: string
    }[] = []
    const meta: { albumId: string; slideIndex: number }[] = []
    for (const a of albums) {
      for (let pi = 0; pi < a.photos.length; pi++) {
        const p = a.photos[pi]!
        meta.push({ albumId: a.id, slideIndex: pi })
        items.push({
          id: `${a.id}-${p.id}`,
          url: resolveGalleryImageUrl(p.imageUrl),
          alt: p.title,
          title: p.title,
        })
      }
    }
    return { angledSliderItems: items, angledSliderMeta: meta }
  }, [albums])

  useEffect(() => {
    setLightbox(null)
  }, [albumId])

  const openAlbumPhoto = (targetAlbumId: string, slideIndex: number) => {
    const target = albums.find((x) => x.id === targetAlbumId)
    if (!target || target.photos.length === 0) return
    const i = Math.max(0, Math.min(slideIndex, target.photos.length - 1))
    flushSync(() => {
      setAlbumId(targetAlbumId)
    })
    setLightbox({ slideIndex: i })
  }

  const scrollToAlbumBloque = (albumId: string) => {
    const id = `galeria-album-bloque-${albumId}`
    const el = document.getElementById(id)
    if (!el) return
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })
    window.history.replaceState(null, '', `#${id}`)
  }

  const lightboxPhoto: GaleriaFoto | null =
    lightbox && photos[lightbox.slideIndex] ? photos[lightbox.slideIndex] : null
  const lightboxImgSrc =
    lightbox && lightboxPhoto
      ? resolveGalleryImageUrl(lightboxPhoto.imageUrl)
      : null

  useEffect(() => {
    if (!lightbox || !album) return
    const n = photos.length
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightbox(null)
        return
      }
      if (n <= 1) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setLightbox((s) =>
          s ? { slideIndex: (s.slideIndex - 1 + n) % n } : null,
        )
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setLightbox((s) =>
          s ? { slideIndex: (s.slideIndex + 1) % n } : null,
        )
      }
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [lightbox, photos.length, album])

  const hasGalleryContent = albums.length > 0 && album !== undefined

  return (
    <div className="galeria-content layout-contained">
      {isAuthenticated ? (
        <div className="admin-banner" role="status">
          <p>
            <strong>Modo administrador</strong> — Gestioná álbumes e imágenes en el
            servidor.
          </p>
          <div className="admin-banner-actions">
            <button type="button" onClick={() => logout()}>
              Cerrar sesión administrador
            </button>
          </div>
        </div>
      ) : null}

      <p className="galeria-section-label">Galería</p>
      <h2 className="galeria-section-title">Álbumes fotográficos</h2>
      <p className="galeria-intro">
        Aquí solo se muestran las fotos publicadas desde el panel de administración.
        Si aún no hay contenido, la galería permanece vacía hasta que se suban
        imágenes al servidor.
      </p>

      {loadPhase === 'loading' ? (
        <p className="galeria-loading" role="status">
          Cargando galería…
        </p>
      ) : null}

      {fetchError ? <p className="galeria-api-note">{fetchError}</p> : null}

      {!fetchError && loadPhase === 'ready' && apiSynced && hasGalleryContent ? (
        <p className="galeria-api-ok">Contenido cargado desde el servidor.</p>
      ) : null}

      {!fetchError && loadPhase === 'ready' && !hasGalleryContent ? (
        <p className="galeria-empty" role="status">
          Todavía no hay fotos publicadas. Cuando el equipo cargue imágenes desde el
          modo administrador, aparecerán aquí automáticamente.
        </p>
      ) : null}

      {hasGalleryContent ? (
        <>
      <section className="galeria-album-panel" aria-live="polite">
        <header className="galeria-album-head">
          <h3 className="galeria-album-title">{album.name}</h3>
          <p className="galeria-album-meta">{album.date}</p>
          <p className="galeria-album-desc">{album.description}</p>
        </header>

        {angledSliderItems.length > 0 ? (
          <div className="galeria-carousel" aria-roledescription="carrusel">
            <AngledSlider
              items={angledSliderItems}
              speed={50}
              direction="left"
              containerHeight="min(52vh, 440px)"
              cardWidth="min(78vw, 300px)"
              gap="36px"
              angle={18}
              hoverScale={1.06}
              onItemClick={(flatIndex) => {
                const m = angledSliderMeta[flatIndex]
                if (!m) return
                openAlbumPhoto(m.albumId, m.slideIndex)
              }}
            />
          </div>
        ) : null}
      </section>

      <section
        className="galeria-por-titulo"
        aria-labelledby="galeria-por-titulo-heading"
      >
        <h3 id="galeria-por-titulo-heading" className="galeria-por-titulo-h2">
          Fotos por álbum y título
        </h3>
        <nav
          className="galeria-por-titulo-jump"
          aria-label="Ir a las fotos de un álbum"
        >
          {albums.map((a) =>
            a.photos.length > 0 ? (
              <a
                key={a.id}
                className="galeria-por-titulo-jump-link"
                href={`#galeria-album-bloque-${a.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToAlbumBloque(a.id)
                }}
              >
                {a.name}
              </a>
            ) : null,
          )}
        </nav>

        <div className="galeria-por-titulo-bloques">
          {albums.map((a) => {
            if (a.photos.length === 0) return null
            const expandido = porTituloExpandido[a.id] === true
            const limite = porTituloPreviewLimit
            const hayMas = a.photos.length > limite
            const visibles =
              expandido || !hayMas ? a.photos : a.photos.slice(0, limite)
            const gridMod =
              hayMas && !expandido
                ? limite === 3
                  ? ' galeria-por-titulo-grid--preview-3'
                  : ' galeria-por-titulo-grid--preview-1'
                : ''
            return (
              <div
                key={a.id}
                id={`galeria-album-bloque-${a.id}`}
                className="galeria-por-titulo-bloque"
              >
                <h4 className="galeria-por-titulo-album">{a.name}</h4>
                <p className="galeria-por-titulo-album-meta">{a.date}</p>
                <div className={`galeria-por-titulo-grid${gridMod}`}>
                  {visibles.map((p, idx) => {
                    const src = resolveGalleryImageUrl(p.imageUrl)
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className="galeria-por-titulo-card"
                        onClick={() => openAlbumPhoto(a.id, idx)}
                        aria-label={`Ampliar: ${p.title}`}
                      >
                        <span className="galeria-por-titulo-card-media">
                          <img
                            src={src}
                            alt=""
                            loading="lazy"
                            draggable={false}
                          />
                        </span>
                        <span className="galeria-por-titulo-card-label">
                          {p.title}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {hayMas ? (
                  <div className="galeria-por-titulo-actions">
                    {expandido ? (
                      <button
                        type="button"
                        className="galeria-por-titulo-ver-mas"
                        onClick={() =>
                          setPorTituloExpandido((s) => ({
                            ...s,
                            [a.id]: false,
                          }))
                        }
                      >
                        Ver menos
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="galeria-por-titulo-ver-mas"
                        onClick={() =>
                          setPorTituloExpandido((s) => ({
                            ...s,
                            [a.id]: true,
                          }))
                        }
                      >
                        Ver más
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </section>
        </>
      ) : null}

      {isAuthenticated && token ? <GaleriaAdminPanel token={token} /> : null}

      {lightbox && lightboxPhoto
        ? createPortal(
            <div
              className="galeria-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={lightboxPhoto.title}
              onClick={() => {
                setLightbox(null)
              }}
            >
              <div
                className="galeria-lightbox-inner"
                onClick={(e) => e.stopPropagation()}
              >
                <header className="galeria-lightbox-head">
                  <div className="galeria-lightbox-head-nav">
                    {photos.length > 1 ? (
                      <button
                        type="button"
                        className="galeria-lightbox-nav"
                        onClick={() =>
                          setLightbox({
                            slideIndex:
                              (lightbox.slideIndex - 1 + photos.length) %
                              photos.length,
                          })
                        }
                        aria-label="Imagen anterior"
                      >
                        ‹ Anterior
                      </button>
                    ) : (
                      <span className="galeria-lightbox-head-spacer" aria-hidden />
                    )}
                    <span className="galeria-lightbox-count">
                      {lightbox.slideIndex + 1} / {photos.length}
                    </span>
                    {photos.length > 1 ? (
                      <button
                        type="button"
                        className="galeria-lightbox-nav"
                        onClick={() =>
                          setLightbox({
                            slideIndex:
                              (lightbox.slideIndex + 1) % photos.length,
                          })
                        }
                        aria-label="Imagen siguiente"
                      >
                        Siguiente ›
                      </button>
                    ) : (
                      <span className="galeria-lightbox-head-spacer" aria-hidden />
                    )}
                  </div>
                  <button
                    type="button"
                    className="galeria-lightbox-close"
                    onClick={() => {
                      setLightbox(null)
                    }}
                  >
                    Cerrar
                  </button>
                </header>
                <div
                  className="galeria-lightbox-stage"
                  style={
                    lightboxImgSrc
                      ? undefined
                      : { background: lightboxPhoto.gradient }
                  }
                >
                  {lightboxImgSrc ? (
                    <img
                      className="galeria-lightbox-img"
                      src={lightboxImgSrc}
                      alt={lightboxPhoto.title}
                    />
                  ) : null}
                  <p className="galeria-lightbox-title">{lightboxPhoto.title}</p>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
