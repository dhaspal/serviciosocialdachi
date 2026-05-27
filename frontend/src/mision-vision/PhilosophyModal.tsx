import { useEffect, useId } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { LOGO_INSTITUCIONAL } from '../brand/logo'
import './PhilosophyModal.css'

type Props = {
  open: boolean
  title: string
  eyebrow?: string
  intro?: string
  onClose: () => void
  children: ReactNode
}

export function PhilosophyModal({
  open,
  title,
  eyebrow,
  intro,
  onClose,
  children,
}: Props) {
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

  if (!open) return null

  return createPortal(
    <div
      className="ph-modal-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="ph-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        style={
          {
            '--ph-logo-url': `url(${LOGO_INSTITUCIONAL})`,
          } as CSSProperties
        }
      >
        <header className="ph-modal-header">
          <div className="ph-modal-heading">
            {eyebrow ? (
              <p className="ph-modal-eyebrow">{eyebrow}</p>
            ) : null}
            <h2 id={titleId} className="ph-modal-title">
              {title}
            </h2>
            {intro ? <p className="ph-modal-intro">{intro}</p> : null}
          </div>
          <button
            type="button"
            className="ph-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="ph-modal-body">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
