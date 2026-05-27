import { useEffect, useId, useState } from 'react'
import { LOGO_INSTITUCIONAL } from '../brand/logo'
import {
  INSTITUTION_ACRONYM,
  INSTITUTION_FULL_NAME,
} from '../brand/institutionName'
import type { SectionId } from '../sections/types'
import './Navigation.css'

const LINKS: { id: SectionId; label: string }[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'catalogo', label: 'Catálogo' },
  { id: 'directivos', label: 'Directivos' },
  { id: 'galeria', label: 'Galería' },
  { id: 'mision', label: 'Misión' },
  { id: 'historia', label: 'Historia' },
  { id: 'blog', label: 'Blog' },
  { id: 'ubicacion', label: 'Ubicación' },
  { id: 'colaboradores', label: 'Colaboradores' },
]

const NAV_BREAKPOINT_PX = 768

type Props = {
  activeSection: SectionId
  onSelect: (id: SectionId) => void
}

export function Navigation({ activeSection, onSelect }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${NAV_BREAKPOINT_PX}px)`)
    const sync = () => {
      if (mq.matches) setMenuOpen(false)
    }
    mq.addEventListener('change', sync)
    sync()
    return () => mq.removeEventListener('change', sync)
  }, [])

  const handleSelect = (id: SectionId) => {
    onSelect(id)
    setMenuOpen(false)
  }

  return (
    <nav className="inst-nav" aria-label="Principal">
      <button
        type="button"
        className="inst-nav-brand inst-nav-brand-btn"
        onClick={() => handleSelect('admin')}
        aria-label="Ir al inicio de sesión de administrador"
      >
        <img
          className="inst-nav-logo"
          src={LOGO_INSTITUCIONAL}
          alt=""
          width={120}
          height={72}
          decoding="async"
        />
        <div className="inst-nav-brand-text">
          <span className="inst-nav-brand-acronym">{INSTITUTION_ACRONYM}</span>
          <span className="inst-nav-brand-official">{INSTITUTION_FULL_NAME}</span>
        </div>
      </button>
      <button
        type="button"
        className={
          menuOpen ? 'inst-nav-burger inst-nav-burger--open' : 'inst-nav-burger'
        }
        aria-expanded={menuOpen}
        aria-controls={menuId}
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span className="inst-nav-burger-bar" aria-hidden="true" />
        <span className="inst-nav-burger-bar" aria-hidden="true" />
        <span className="inst-nav-burger-bar" aria-hidden="true" />
      </button>
      <div
        id={menuId}
        className={
          menuOpen
            ? 'inst-nav-links inst-nav-links--open'
            : 'inst-nav-links'
        }
      >
        {LINKS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={
              id === activeSection
                ? 'inst-nav-link inst-nav-link--active'
                : 'inst-nav-link'
            }
            onClick={() => handleSelect(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
