import { useMemo, useState, type CSSProperties } from 'react'
import { INSTITUTION_FULL_NAME } from '../brand/institutionName'
import { HISTORIA_HITOS } from './data'
import { HistoriaModal } from './HistoriaModal'
import { ScrollTimeline } from './ScrollTimeline'
import './Historia.css'

export function Historia() {
  const [narrativaAbierta, setNarrativaAbierta] = useState(false)

  const timelineEvents = useMemo(
    () =>
      HISTORIA_HITOS.map((h) => ({
        year: h.year,
        title: h.title,
        subtitle: h.badge,
        description: h.summary,
      })),
    [],
  )

  const timelineSubtitle =
    `Hitos principales de la creación de la ${INSTITUTION_FULL_NAME}, desde las asambleas de 2013 hasta la situación actual de sedes y legalización. Para el relato completo, abre «Historia narrada completa».`

  return (
    <div className="hist-content layout-contained">
      <p className="hist-section-label">Nuestra historia</p>
      <p className="hist-lead">{timelineSubtitle}</p>

      <div className="hist-actions">
        <button
          type="button"
          className="hist-btn-narrativa"
          onClick={() => setNarrativaAbierta(true)}
        >
          Historia narrada completa
        </button>
      </div>

      <div
        className="hist-scroll-outer"
        style={
          {
            '--hist-timeline-bg': `url(${import.meta.env.BASE_URL}historia-timeline-bg.jpg)`,
          } as CSSProperties
        }
      >
        <ScrollTimeline
          title="Línea de tiempo"
          subtitle="Desplázate: la barra y el punto luminoso avanzan con tu lectura; cada tarjeta se revela al acercarse al centro de la pantalla."
          events={timelineEvents}
        />
      </div>

      <div className="hist-actions hist-actions--after">
        <button
          type="button"
          className="hist-btn-narrativa hist-btn-narrativa--outline"
          onClick={() => setNarrativaAbierta(true)}
        >
          Ver historia narrada completa
        </button>
      </div>

      <HistoriaModal
        open={narrativaAbierta}
        onClose={() => setNarrativaAbierta(false)}
      />
    </div>
  )
}
