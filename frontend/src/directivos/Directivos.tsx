import { useState } from 'react'
import type { CSSProperties } from 'react'
import { INSTITUTION_FULL_NAME } from '../brand/institutionName'
import {
  PERFILES_EQUIPO,
  type PerfilId,
  type PerfilRequerimiento,
} from './data'
import { DIRECTIVOS_SECTION_BG } from './content'
import { RequisitosModal } from './RequisitosModal'
import './Directivos.css'

const DOC_ARC_PATH =
  'M36.63 31.746 c0 -13.394 -7.3260000000000005 -25.16 -18.13 -31.375999999999998 C7.696 6.66 0.37 18.352 0.37 31.746 c5.328 3.108 11.544 4.8839999999999995 18.13 4.8839999999999995 S31.301999999999996 34.854 36.63 31.746z'

const EDU_FLOR_PATH =
  'M29.760000000000005 18.72 c0 7.28 -3.9200000000000004 13.600000000000001 -9.840000000000002 16.96 c -2.8800000000000003 1.6800000000000002 -6.24 2.64 -9.840000000000002 2.64 c -3.6 0 -6.88 -0.96 -9.76 -2.64 c0 -7.28 3.9200000000000004 -13.52 9.840000000000002 -16.96 c2.8800000000000003 -1.6800000000000002 6.24 -2.64 9.76 -2.64 S26.880000000000003 17.040000000000003 29.760000000000005 18.72 c5.84 3.3600000000000003 9.76 9.68 9.840000000000002 16.96 c -2.8800000000000003 1.6800000000000002 -6.24 2.64 -9.76 2.64 c -3.6 0 -6.88 -0.96 -9.840000000000002 -2.64 c -5.84 -3.3600000000000003 -9.76 -9.68 -9.76 -16.96 c0 -7.28 3.9200000000000004 -13.600000000000001 9.76 -16.96 C25.84 5.120000000000001 29.760000000000005 11.440000000000001 29.760000000000005 18.72z'

function DirectivoPhotoVisual({ id }: { id: PerfilId }) {
  switch (id) {
    case 'rector':
      return (
        <div className="dir-ph-dots" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="dir-ph-dots__dot" />
          ))}
        </div>
      )
    case 'coordinador':
      return <div className="dir-ph-orbit" aria-hidden="true" />
    case 'orientacion':
      return (
        <div className="dir-ph-sq" aria-hidden="true">
          <div className="dir-ph-sq-half" />
          <div className="dir-ph-sq-half" />
        </div>
      )
    case 'docente':
      return (
        <svg
          className="dir-ph-svg"
          viewBox="0 0 37 37"
          height="37"
          width="37"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <path
            className="dir-ph-svg__track"
            fill="none"
            strokeWidth="5"
            pathLength="100"
            d={DOC_ARC_PATH}
          />
          <path
            className="dir-ph-svg__car"
            fill="none"
            strokeWidth="5"
            pathLength="100"
            d={DOC_ARC_PATH}
          />
        </svg>
      )
    case 'educando':
      return (
        <svg
          className="dir-ph-svg-edu"
          viewBox="0 0 40 40"
          height="40"
          width="40"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <path
            className="dir-ph-svg-edu__track"
            fill="none"
            strokeWidth="4"
            pathLength="100"
            d={EDU_FLOR_PATH}
          />
          <path
            className="dir-ph-svg-edu__car"
            fill="none"
            strokeWidth="4"
            pathLength="100"
            d={EDU_FLOR_PATH}
          />
        </svg>
      )
    default: {
      const _e: never = id
      return _e
    }
  }
}

export function Directivos() {
  const [modalPerfil, setModalPerfil] = useState<PerfilRequerimiento | null>(
    null,
  )

  return (
    <section
      className="dir-section"
      style={
        {
          '--dir-section-bg-image': `url(${DIRECTIVOS_SECTION_BG})`,
        } as CSSProperties
      }
    >
      <div className="dir-content layout-contained">
        <p className="dir-section-label">Equipo</p>
        <h2 className="dir-section-title">Directivos</h2>
        <p className="dir-lead">
          Conoce al equipo directivo y los perfiles que orientan la vida de la{' '}
          {INSTITUTION_FULL_NAME}. Pulsa «Requerimientos» para
          ver el texto completo de cada perfil según el documento institucional.
        </p>

        <div className="dir-grid">
          {PERFILES_EQUIPO.map((p) => (
            <article key={p.id} className="dir-card">
              <div
                className={`dir-photo dir-photo--${p.variant}`}
                aria-hidden="true"
              >
                <DirectivoPhotoVisual id={p.id} />
              </div>
              <h3 className="dir-name">{p.name}</h3>
              <p className="dir-role">{p.role}</p>
              <p className="dir-area">{p.area}</p>
              <p className="dir-summary">{p.summary}</p>
              {p.requerimientos ? (
                <div className="dir-card-actions">
                  <button
                    type="button"
                    className="dir-btn-req"
                    onClick={() => setModalPerfil(p.requerimientos!)}
                  >
                    Requerimientos
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>

        <RequisitosModal
          open={modalPerfil !== null}
          perfil={modalPerfil}
          onClose={() => setModalPerfil(null)}
        />
      </div>
    </section>
  )
}
