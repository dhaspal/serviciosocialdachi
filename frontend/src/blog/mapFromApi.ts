import type { ApiPostBlog } from '../api/types'
import { INSTITUTION_FULL_NAME } from '../brand/institutionName'
import type { BlogCategory, BlogPost } from './types'

const ALLOWED: BlogCategory[] = [
  'PEC 2026',
  'Noticias',
  'Eventos',
  'Comunicados',
  'Logros',
  'Actividades',
]

export function mapEtiquetasToCategory(etiquetas: string[]): BlogCategory {
  const hit = etiquetas.find((e) =>
    ALLOWED.includes(e as BlogCategory),
  ) as BlogCategory | undefined
  return hit ?? 'Noticias'
}

export function mapApiPostToBlogPost(p: ApiPostBlog): BlogPost {
  const chunks = p.contenido
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
  const paragraphs =
    chunks.length > 0 ? chunks : [p.contenido.trim() || '—']
  const date =
    typeof p.creado_en === 'string' && p.creado_en.length >= 10
      ? p.creado_en.slice(0, 10)
      : '—'

  return {
    id: p.id,
    title: p.titulo,
    author: INSTITUTION_FULL_NAME,
    date,
    category: mapEtiquetasToCategory(p.etiquetas),
    excerpt: p.resumen,
    sections: [{ heading: 'Contenido', paragraphs }],
    tags: p.etiquetas ?? [],
  }
}
