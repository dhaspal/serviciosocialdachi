import { useState, type CSSProperties } from 'react'
import { LOGO_UNIVERSIDAD_PEREIRA } from '../brand/logo'
import { COLABORADORES, PROYECTO_NARRATIVAS } from './data'
import { TiltCard } from '../components/TiltCard'
import './Colaboradores.css'

function ColaboradorPhoto({
  photo,
  photoFallback,
  name,
}: {
  photo: string
  photoFallback: string
  name: string
}) {
  const [src, setSrc] = useState(photo)

  return (
    <img
      className="col-card__photo"
      src={src}
      alt={`Fotografía de ${name}`}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (src !== photoFallback) setSrc(photoFallback)
      }}
    />
  )
}

export function Colaboradores() {
  return (
    <section className="col-section" aria-labelledby="col-section-title">
      <div className="col-content layout-contained">
        <p className="col-section-label">Reconocimiento</p>
        <h2 id="col-section-title" className="col-section-title">
          Colaboradores
        </h2>
        <p className="col-lead">
          Personas e instituciones que acompañaron el proceso de investigación y
          formulación del proyecto de innovación social con la comunidad.
        </p>

        <article
          className="col-project"
          style={
            {
              '--col-project-bg-image': `url(${LOGO_UNIVERSIDAD_PEREIRA})`,
            } as CSSProperties
          }
        >
          <header className="col-project__header">
            <span className="col-project__badge">Proyecto UCP</span>
            <h3 className="col-project__title">{PROYECTO_NARRATIVAS.title}</h3>
          </header>
          <div className="col-project__body">
            {PROYECTO_NARRATIVAS.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="col-project__text">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        <div className="col-team">
          <h3 className="col-team__title">Perfil de los investigadores</h3>
          <div className="col-team__grid">
            {COLABORADORES.map((person) => (
              <TiltCard key={person.id} className="col-card-wrap">
                <article className="col-card">
                  <div className="col-card__photo-frame">
                    <ColaboradorPhoto
                      photo={person.photo}
                      photoFallback={person.photoFallback}
                      name={person.name}
                    />
                  </div>
                  <div className="col-card__body">
                    <h4 className="col-card__name">{person.name}</h4>
                    <p className="col-card__role">{person.role}</p>
                    <a
                      className="col-card__link"
                      href={person.cvlacUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Ver currículo en CvLAC
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
