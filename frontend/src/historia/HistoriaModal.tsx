import { useEffect, useId } from 'react'
import { INSTITUTION_FULL_NAME } from '../brand/institutionName'
import { HISTORIA_NARRATIVA_SECCIONES } from './narrativaCompleta'
import './HistoriaModal.css'

type Props = {
  open: boolean
  onClose: () => void
}

export function HistoriaModal({ open, onClose }: Props) {
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

  return (
    <div
      className="hist-modal-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="hist-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="hist-modal-header">
          <div>
            <p className="hist-modal-kicker">Documento institucional</p>
            <h2 id={titleId} className="hist-modal-title">
              Historia narrada de la {INSTITUTION_FULL_NAME}
            </h2>
          </div>
          <button
            type="button"
            className="hist-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="hist-modal-body">
          <p className="hist-modal-intro">
            Texto consolidado a partir del relato oficial de la comunidad y los
            hitos de creación de la institución (2013 en adelante).
          </p>
          {HISTORIA_NARRATIVA_SECCIONES.map((sec) => (
            <section key={sec.titulo} className="hist-modal-section">
              <h3 className="hist-modal-section-title">{sec.titulo}</h3>
              {sec.parrafos.map((p, i) => (
                <p key={i} className="hist-modal-p">
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
