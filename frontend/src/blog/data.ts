export type { BlogCategory, BlogPost, BlogSection } from './types'
export { PEC_BLOG_POSTS } from './pec2026Posts'

import type { BlogCategory } from './types'
import { PEC_BLOG_POSTS } from './pec2026Posts'

export const BLOG_POSTS = PEC_BLOG_POSTS

export const BLOG_CATEGORIES: BlogCategory[] = [
  'PEC 2026',
  'Noticias',
  'Eventos',
  'Comunicados',
  'Logros',
  'Actividades',
]
