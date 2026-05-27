import { useEffect, useId } from 'react'
import { INSTITUTION_FULL_NAME } from '../brand/institutionName'
import type { BlogPost } from './types'
import './BlogArticleModal.css'

type Props = {
  open: boolean
  post: BlogPost | null
  onClose: () => void
}

export function BlogArticleModal({ open, post, onClose }: Props) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open || !post) return null

  return (
    <div
      className="blog-art-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="blog-art-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="blog-art-header">
          <div>
            <p className="blog-art-meta">
              {post.date} · {post.category}
              {post.author ? ` · ${post.author}` : ''}
            </p>
            <h2 id={titleId} className="blog-art-title">
              {post.title}
            </h2>
            <p className="blog-art-source">
              Fragmentos tomados del PEC 2026 — {INSTITUTION_FULL_NAME}.
            </p>
          </div>
          <button
            type="button"
            className="blog-art-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="blog-art-body">
          {post.sections.map((sec) => (
            <section key={sec.heading} className="blog-art-block">
              <h3 className="blog-art-h3">{sec.heading}</h3>
              {sec.paragraphs.map((p, i) => (
                <p key={i} className="blog-art-p">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
