import { useLayoutEffect, useState } from 'react'
import { Blog } from './blog/Blog'
import { Catalogo } from './catalogo/Catalogo'
import { Directivos } from './directivos/Directivos'
import { SiteFooter } from './footer/SiteFooter'
import { Galeria } from './galeria/Galeria'
import { Historia } from './historia/Historia'
import { Inicio } from './inicio/Inicio'
import { MisionVision } from './mision-vision/MisionVision'
import { FloatingWhatsAppButton } from './floating-whatsapp/FloatingWhatsAppButton'
import { Navigation } from './navigation/Navigation'
import { Colaboradores } from './colaboradores/Colaboradores'
import type { SectionId } from './sections/types'
import { Ubicacion } from './ubicacion/Ubicacion'
import { AdminLogin } from './admin/AdminLogin'

function renderSection(id: SectionId, onNavigate: (s: SectionId) => void) {
  switch (id) {
    case 'inicio':
      return <Inicio onNavigate={onNavigate} />
    case 'mision':
      return <MisionVision />
    case 'historia':
      return <Historia />
    case 'directivos':
      return <Directivos />
    case 'catalogo':
      return <Catalogo />
    case 'galeria':
      return <Galeria />
    case 'ubicacion':
      return <Ubicacion />
    case 'colaboradores':
      return <Colaboradores />
    case 'blog':
      return <Blog />
    case 'admin':
      return <AdminLogin onNavigate={onNavigate} />
    default: {
      const _exhaustive: never = id
      return _exhaustive
    }
  }
}

export default function App() {
  const [section, setSection] = useState<SectionId>('inicio')

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [section])

  return (
    <div className="site-wrapper">
      <Navigation activeSection={section} onSelect={setSection} />
      <main id="contenido-principal">{renderSection(section, setSection)}</main>
      <SiteFooter onNavigate={setSection} />
      <FloatingWhatsAppButton />
    </div>
  )
}
