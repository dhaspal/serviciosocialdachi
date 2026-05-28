import {
  LOGO_INSTITUCIONAL,
  LOGO_UNIVERSIDAD_PEREIRA,
  UNIVERSIDAD_PEREIRA_NOMBRE,
} from '../brand/logo'
import { INSTITUTION_CONTACT } from '../brand/institutionContact'
import { INSTITUTION_FULL_NAME } from '../brand/institutionName'
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
  const { direccion, telefono, telefonoDigits } = INSTITUTION_CONTACT

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
              <p className="site-footer-name">{INSTITUTION_FULL_NAME}</p>
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
            <li>{direccion}</li>
            <li>
              <a href={`tel:${telefonoDigits}`}>{telefono}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="site-footer-bar">
        <p className="site-footer-copy">
          © {new Date().getFullYear()} {INSTITUTION_FULL_NAME}. Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  )
}
