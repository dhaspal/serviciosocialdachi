import { useEffect, useId } from 'react'
import type { CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { LOGO_INSTITUCIONAL } from '../brand/logo'
import type { PerfilRequerimiento } from './data'
import { obtenerDocumentoRequisitos } from './requisitosPorPerfil'
import './RequisitosModal.css'

type Props = {
  open: boolean
  perfil: PerfilRequerimiento | null
  onClose: () => void
}

export function RequisitosModal({ open, perfil, onClose }: Props) {
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

  if (!open || !perfil) return null

  const doc = obtenerDocumentoRequisitos(perfil)

  return createPortal(
    <div
      className="dir-req-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="dir-req-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        style={
          {
            '--dir-req-logo-url': `url(${LOGO_INSTITUCIONAL})`,
          } as CSSProperties
        }
      >
        <header className="dir-req-header">
          <div>
            <p className="dir-req-ref">{doc.referencia}</p>
            <h2 id={titleId} className="dir-req-title">
              {doc.tituloModal}
            </h2>
          </div>
          <button
            type="button"
            className="dir-req-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="dir-req-body">
          {doc.introduccion ? (
            <p className="dir-req-intro">{doc.introduccion}</p>
          ) : null}
          {doc.bloques.map((bloque) => (
            <section key={bloque.titulo} className="dir-req-block">
              <h3 className="dir-req-block-title">{bloque.titulo}</h3>
              {bloque.parrafos?.map((p, i) => (
                <p key={i} className="dir-req-p">
                  {p}
                </p>
              ))}
              {bloque.viñetas?.length ? (
                <ul className="dir-req-ul">
                  {bloque.viñetas.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
