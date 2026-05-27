import {
  LOGO_INSTITUCIONAL,
  LOGO_UNIVERSIDAD_PEREIRA,
  UNIVERSIDAD_PEREIRA_NOMBRE,
} from '../brand/logo'
import { env } from '../config/env'
import type { SectionId } from '../sections/types'
import './SiteFooter.css'

const MAP: { id: SectionId; label: string }[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'catalogo', label: 'Catálogo' },
  { id: 'directivos', label: 'Directivos' },
  { id: 'galeria', label: 'Galería' },
  { id: 'mision', label: 'Misión, visión y valores' },
  { id: 'historia', label: 'Historia' },
  { id: 'blog', label: 'Blog' },
  { id: 'ubicacion', label: 'Ubicación' },
  { id: 'colaboradores', label: 'Colaboradores' },
]

type Props = {
  onNavigate: (id: SectionId) => void
}

export function SiteFooter({ onNavigate }: Props) {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner layout-contained">
        <div className="site-footer-brand">
          <div className="site-footer-brand-primary">
            <img
              className="site-footer-logo"
              src={LOGO_INSTITUCIONAL}
              alt=""
              width={100}
              height={60}
              decoding="async"
            />
            <div>
              <p className="site-footer-name">{env.appName}</p>
              <p className="site-footer-tag">Comunidad educativa Embera Chamí</p>
            </div>
          </div>
          <div className="site-footer-partner">
            <img
              className="site-footer-partner-logo"
              src={LOGO_UNIVERSIDAD_PEREIRA}
              alt=""
              width={120}
              height={48}
              decoding="async"
            />
            <p className="site-footer-partner-name">
              {UNIVERSIDAD_PEREIRA_NOMBRE}
            </p>
          </div>
        </div>

        <nav className="site-footer-col" aria-label="Mapa del sitio">
          <p className="site-footer-heading">Mapa del sitio</p>
          <ul className="site-footer-list">
            {MAP.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="site-footer-link"
                  onClick={() => onNavigate(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer-col">
          <p className="site-footer-heading">Contacto</p>
          <ul className="site-footer-list site-footer-list--plain">
            <li>{env.institutionAddress}</li>
            {env.institutionEmail ? (
              <li>
                <a href={`mailto:${env.institutionEmail}`}>
                  {env.institutionEmail}
                </a>
              </li>
            ) : null}
            {env.institutionPhone ? <li>Tel. {env.institutionPhone}</li> : null}
            {env.institutionMobile ? <li>Cel. {env.institutionMobile}</li> : null}
          </ul>
        </div>

        <div className="site-footer-col">
          <p className="site-footer-heading">Redes sociales</p>
          <ul className="site-footer-social">
            {env.facebookUrl ? (
              <li>
                <a href={env.facebookUrl} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>
            ) : null}
            {env.instagramUrl ? (
              <li>
                <a href={env.instagramUrl} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
            ) : null}
            {env.youtubeUrl ? (
              <li>
                <a href={env.youtubeUrl} target="_blank" rel="noreferrer">
                  YouTube
                </a>
              </li>
            ) : null}
            {!env.facebookUrl && !env.instagramUrl && !env.youtubeUrl ? (
              <li className="site-footer-muted">
                Configura URLs en <code>.env</code> (VITE_FACEBOOK_URL, etc.).
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="site-footer-bar">
        <p className="site-footer-copy">
          © {new Date().getFullYear()} {env.appName}. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  )
}
