import { useState, type CSSProperties } from 'react'
import {
  FILOSOFIA,
  FORMAR_KATIOS_KATIAS,
  MARCO_DECRETO_PARRAFO_1,
  MARCO_DECRETO_PARRAFO_2,
  MISION,
  MISION_SECTION_BG,
  NOMBRE_INSTITUCION,
  OBJETIVO_GENERAL,
  OBJETIVOS_ESPECIFICOS,
  type PhilosophyCardId,
  PHILOSOPHY_CARDS,
  UNA_SOCIEDAD_KATIA,
  VISION,
} from './content'
import { PhilosophyModal } from './PhilosophyModal'
import './MisionVision.css'

function ModalBody({ id }: { id: PhilosophyCardId }) {
  switch (id) {
    case 'formar':
      return (
        <>
          <h3 className="mv-block-subtitle mv-block-subtitle--accent">
            Katíos y Katías: perfil que cultivamos
          </h3>
          <ul className="mv-long-list">
            {FORMAR_KATIOS_KATIAS.map((item, i) => (
              <li key={`formar-${i}`}>{item}</li>
            ))}
          </ul>
          <h3 className="mv-block-subtitle mv-block-subtitle--accent">
            Una sociedad Katía en comunidad
          </h3>
          <p className="mv-prose">{UNA_SOCIEDAD_KATIA}</p>
        </>
      )
    case 'mision':
      return <p className="mv-prose">{MISION}</p>
    case 'vision':
      return <p className="mv-prose">{VISION}</p>
    case 'filosofia':
      return <p className="mv-prose">{FILOSOFIA}</p>
    case 'objetivo':
      return <p className="mv-prose">{OBJETIVO_GENERAL}</p>
    case 'objetivos':
      return (
        <ul className="mv-long-list mv-long-list--objectives">
          {OBJETIVOS_ESPECIFICOS.map((item, i) => (
            <li key={`obj-${i}`}>{item}</li>
          ))}
        </ul>
      )
    case 'marco':
      return (
        <>
          <p className="mv-prose">{MARCO_DECRETO_PARRAFO_1}</p>
          <p className="mv-prose">{MARCO_DECRETO_PARRAFO_2}</p>
        </>
      )
    default: {
      const _e: never = id
      return _e
    }
  }
}

export function MisionVision() {
  const [openId, setOpenId] = useState<PhilosophyCardId | null>(null)

  const activeCard = openId
    ? PHILOSOPHY_CARDS.find((c) => c.id === openId)
    : null

  return (
    <section
      className="mv-section"
      style={
        {
          '--mv-section-bg-image': `url(${MISION_SECTION_BG})`,
        } as CSSProperties
      }
    >
    <div className="mv-content layout-contained">
      <p className="mv-section-label">Proyecto educativo</p>
      <h1 className="mv-section-title">Misión, visión y filosofía</h1>
      <p className="mv-lead">
        <strong>{NOMBRE_INSTITUCION}</strong> — comunidad indígena de Kemberde,
        resguardo Gito Dokabu, Pueblo Rico, Risaralda. Pueblo indígena Embera
        Katio.
      </p>

      <div className="mv-grid">
        {PHILOSOPHY_CARDS.map((card) => (
          <article
            key={card.id}
            className={`mv-tile mv-tile--${card.id}`}
          >
            <h2 className="mv-tile-title">{card.title}</h2>
            <p className="mv-tile-summary">{card.summary}</p>
            <button
              type="button"
              className="mv-tile-more"
              onClick={() => setOpenId(card.id)}
            >
              Ver más
            </button>
          </article>
        ))}
      </div>

      <PhilosophyModal
        open={openId !== null}
        title={activeCard?.title ?? ''}
        eyebrow={activeCard?.modalEyebrow}
        intro={activeCard?.modalIntro}
        onClose={() => setOpenId(null)}
      >
        {openId ? <ModalBody id={openId} /> : null}
      </PhilosophyModal>
    </div>
    </section>
  )
}
