import { env } from '../config/env'
import './Ubicacion.css'

function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

export function Ubicacion() {
  const wa = env.whatsappE164 ? digitsOnly(env.whatsappE164) : ''
  const waHref = wa ? `https://wa.me/${wa}` : undefined
  const telMobile = env.institutionMobile
    ? `tel:${digitsOnly(env.institutionMobile)}`
    : undefined
  const telPhone = env.institutionPhone
    ? `tel:${digitsOnly(env.institutionPhone)}`
    : undefined

  return (
    <div className="ubi-content layout-contained">
      <p className="ubi-section-label">Dónde estamos</p>
      <h2 className="ubi-section-title">Ubicación y contacto</h2>

      <div className="ubi-grid">
        <div className="ubi-map-card">
          {env.googleMapsEmbedUrl ? (
            <iframe
              title="Mapa del colegio"
              className="ubi-iframe"
              src={env.googleMapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <div className="ubi-map-fallback" aria-hidden="true" />
          )}
        </div>

        <aside className="ubi-aside">
          <section className="ubi-panel" aria-labelledby="ubi-contact-title">
            <h3 id="ubi-contact-title" className="ubi-panel-title">
              Datos de contacto
            </h3>
            <ul className="ubi-list">
              <li>
                <span className="ubi-k">Dirección</span>
                <span className="ubi-v">
                  {env.institutionAddress ||
                    'Territorio Embera Chamí, Risaralda, Colombia'}
                </span>
              </li>
              {env.institutionEmail ? (
                <li>
                  <span className="ubi-k">Correo</span>
                  <a className="ubi-v" href={`mailto:${env.institutionEmail}`}>
                    {env.institutionEmail}
                  </a>
                </li>
              ) : null}
              {env.institutionPhone ? (
                <li>
                  <span className="ubi-k">Teléfono fijo</span>
                  <a className="ubi-v" href={telPhone}>
                    {env.institutionPhone}
                  </a>
                </li>
              ) : null}
              {env.institutionMobile ? (
                <li>
                  <span className="ubi-k">Celular</span>
                  <a className="ubi-v" href={telMobile}>
                    {env.institutionMobile}
                  </a>
                </li>
              ) : null}
            </ul>
            <div className="ubi-actions">
              {telMobile ? (
                <a className="ubi-btn" href={telMobile}>
                  Llamar ahora
                </a>
              ) : null}
              {waHref ? (
                <a
                  className="ubi-btn ubi-btn--wa"
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp Business
                </a>
              ) : (
                <p className="ubi-hint">
                  Define <strong>VITE_INST_WHATSAPP_E164</strong> para habilitar
                  WhatsApp.
                </p>
              )}
            </div>
          </section>

          <section className="ubi-panel" aria-labelledby="ubi-hours-title">
            <h3 id="ubi-hours-title" className="ubi-panel-title">
              Horarios
            </h3>
            <ul className="ubi-list ubi-list--plain">
              <li>
                <span className="ubi-k">Secretaría</span>
                <span className="ubi-v">Lunes a viernes · 8:00 a 12:00 y 14:00 a 17:00</span>
              </li>
              <li>
                <span className="ubi-k">Atención al público</span>
                <span className="ubi-v">Previa agenda en coordinación</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
