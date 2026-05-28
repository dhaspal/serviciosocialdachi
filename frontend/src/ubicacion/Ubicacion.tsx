import { UBICACION_INSTITUCION } from './content'
import './Ubicacion.css'

export function Ubicacion() {
  const { telefono, telefonoDigits } = UBICACION_INSTITUCION
  const telHref = `tel:${telefonoDigits}`
  const waHref = `https://wa.me/${telefonoDigits}`

  return (
    <div className="ubi-content layout-contained">
      <header className="ubi-header">
        <p className="ubi-section-label">Dónde estamos</p>
        <h2 className="ubi-section-title">Ubicación y contacto</h2>
      </header>

      <article className="ubi-identity" aria-label="Datos institucionales">
        <h3 className="ubi-identity__name">{UBICACION_INSTITUCION.nombreLegal}</h3>
        <dl className="ubi-identity__meta">
          <div className="ubi-identity__row">
            <dt>NIT</dt>
            <dd>{UBICACION_INSTITUCION.nit}</dd>
          </div>
          <div className="ubi-identity__row">
            <dt>Ubicación</dt>
            <dd>{UBICACION_INSTITUCION.comunidad}</dd>
          </div>
          <div className="ubi-identity__row">
            <dt>Teléfono y WhatsApp</dt>
            <dd>
              <a className="ubi-identity__link" href={telHref}>
                {telefono}
              </a>
            </dd>
          </div>
        </dl>
        <div className="ubi-actions">
          <a className="ubi-btn" href={telHref}>
            Llamar
          </a>
          <a
            className="ubi-btn ubi-btn--wa"
            href={waHref}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </article>

      <section className="ubi-panel" aria-labelledby="ubi-hours-title">
        <h3 id="ubi-hours-title" className="ubi-panel-title">
          Horarios
        </h3>
        <ul className="ubi-list ubi-list--plain">
          <li>
            <span className="ubi-k">Secretaría</span>
            <span className="ubi-v">
              Lunes a viernes · 8:00 a 12:00 y 14:00 a 17:00
            </span>
          </li>
          <li>
            <span className="ubi-k">Atención al público</span>
            <span className="ubi-v">Previa agenda en coordinación</span>
          </li>
        </ul>
      </section>
    </div>
  )
}
