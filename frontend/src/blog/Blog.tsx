import { useEffect, useMemo, useState } from 'react'
import { INSTITUTION_FULL_NAME } from '../brand/institutionName'
import { useAdminAuth } from '../admin/AdminAuthContext'
import '../admin/AdminManage.css'
import { getPosts } from '../api/blogApi'
import { BlogAdminPanel } from './BlogAdminPanel'
import { BlogArticleModal } from './BlogArticleModal'
import './Blog.css'
import { BLOG_POSTS } from './data'
import { mapApiPostToBlogPost } from './mapFromApi'
import type { BlogCategory, BlogPost } from './types'

function currentPageUrl() {
  return typeof window !== 'undefined' ? window.location.href : ''
}

function postSearchBlob(p: BlogPost) {
  const sec = p.sections
    .map((s) => `${s.heading} ${s.paragraphs.join(' ')}`)
    .join(' ')
  return `${p.title} ${p.excerpt} ${p.tags.join(' ')} ${sec}`.toLowerCase()
}

export function Blog() {
  const { isAuthenticated, token, logout } = useAdminAuth()
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS)
  const [apiOk, setApiOk] = useState(false)
  const [apiWarning, setApiWarning] = useState<string | null>(null)

  const [q, setQ] = useState('')
  const [cat, setCat] = useState<BlogCategory | 'todas'>('todas')
  const [page, setPage] = useState(1)
  const [openPostId, setOpenPostId] = useState<string | null>(null)
  const pageSize = 6

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const list = await getPosts({ publicados: true, limit: 400 })
        if (cancelled) return
        if (list.length === 0) {
          setPosts(BLOG_POSTS)
          setApiOk(false)
          setApiWarning(
            'El blog del servidor no tiene entradas publicadas aún; se muestran las entradas locales del PEC 2026.',
          )
          return
        }
        setPosts(list.map(mapApiPostToBlogPost))
        setApiOk(true)
        setApiWarning(null)
      } catch {
        if (!cancelled) {
          setPosts(BLOG_POSTS)
          setApiOk(false)
          setApiWarning(
            'No se pudo conectar al servidor; mostrando contenido local del PEC 2026.',
          )
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const categoryOptions = useMemo(() => {
    const s = new Set<BlogCategory>()
    for (const p of posts) s.add(p.category)
    return Array.from(s).sort()
  }, [posts])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return posts
      .filter((p) => {
        const okCat = cat === 'todas' || p.category === cat
        if (!okCat) return false
        if (!needle) return true
        return postSearchBlob(p).includes(needle)
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [q, cat, posts])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageSafe = Math.min(page, totalPages)
  const slice = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize)

  const openPost =
    openPostId === null ? null : (posts.find((p) => p.id === openPostId) ?? null)

  return (
    <div className="blog-page layout-contained">
      {isAuthenticated ? (
        <div className="admin-banner" role="status">
          <p>
            <strong>Modo administrador</strong> — Creá y editá entradas del blog en
            el servidor.
          </p>
          <div className="admin-banner-actions">
            <button type="button" onClick={() => logout()}>
              Cerrar sesión administrador
            </button>
          </div>
        </div>
      ) : null}

      <header className="blog-header">
        <p className="blog-kicker">Blog</p>
        <h1 className="blog-title">PEC y comunicados</h1>
        <p className="blog-sub">
          Contenido del Proyecto Educativo Comunitario (PEC) 2026 de la{' '}
          {INSTITUTION_FULL_NAME}. Las entradas publicadas en el servidor sustituyen al
          listado local cuando la API responde correctamente.
        </p>
      </header>

      {apiWarning ? <p className="blog-api-note">{apiWarning}</p> : null}
      {apiOk ? (
        <p className="blog-api-ok">Mostrando entradas desde el backend.</p>
      ) : null}

      <div className="blog-toolbar">
        <label className="blog-search">
          <span className="blog-sr-label">Buscar</span>
          <input
            type="search"
            placeholder="Buscar en títulos, temas y texto…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(1)
            }}
            autoComplete="off"
          />
        </label>
        <div className="blog-cats" role="group" aria-label="Categoría">
          <button
            type="button"
            className={
              cat === 'todas' ? 'blog-cat blog-cat--active' : 'blog-cat'
            }
            onClick={() => {
              setCat('todas')
              setPage(1)
            }}
          >
            Todas
          </button>
          {categoryOptions.map((c) => (
            <button
              key={c}
              type="button"
              className={c === cat ? 'blog-cat blog-cat--active' : 'blog-cat'}
              onClick={() => {
                setCat(c)
                setPage(1)
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="blog-list">
        {slice.map((p) => (
          <article key={p.id} className="blog-card">
            <div className="blog-card-body">
              <p className="blog-card-meta">
                {p.date} · {p.category} · {p.author}
              </p>
              <h2 className="blog-card-title">{p.title}</h2>
              <p className="blog-card-excerpt">{p.excerpt}</p>
              <p className="blog-card-sections-hint">
                {p.sections.length} apartado{p.sections.length === 1 ? '' : 's'}:{' '}
                {p.sections.map((s) => s.heading).join(' · ')}
              </p>
              <div className="blog-card-tags">
                {p.tags.map((t) => (
                  <span key={t} className="blog-tag">
                    {t}
                  </span>
                ))}
              </div>
              <div className="blog-card-actions">
                <button
                  type="button"
                  className="blog-read-btn"
                  onClick={() => setOpenPostId(p.id)}
                >
                  Leer artículo
                </button>
              </div>
              <div className="blog-share">
                <span className="blog-share-label">Compartir:</span>
                <a
                  className="blog-share-link"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentPageUrl())}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Facebook
                </a>
                <a
                  className="blog-share-link"
                  href={`https://wa.me/?text=${encodeURIComponent(`${p.title} ${currentPageUrl()}`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="blog-empty">No hay publicaciones que coincidan.</p>
      ) : null}

      <nav className="blog-pager" aria-label="Paginación">
        <button
          type="button"
          className="blog-page-btn"
          disabled={pageSafe <= 1}
          onClick={() => setPage((n) => Math.max(1, n - 1))}
        >
          Anterior
        </button>
        <span className="blog-page-status">
          Página {pageSafe} de {totalPages}
        </span>
        <button
          type="button"
          className="blog-page-btn"
          disabled={pageSafe >= totalPages}
          onClick={() => setPage((n) => Math.min(totalPages, n + 1))}
        >
          Siguiente
        </button>
      </nav>

      {isAuthenticated && token ? <BlogAdminPanel token={token} /> : null}

      <BlogArticleModal
        open={openPost !== null}
        post={openPost}
        onClose={() => setOpenPostId(null)}
      />
    </div>
  )
}
