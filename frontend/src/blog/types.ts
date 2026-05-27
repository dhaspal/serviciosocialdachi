export type BlogCategory =
  | 'Noticias'
  | 'Eventos'
  | 'Comunicados'
  | 'Logros'
  | 'Actividades'
  | 'PEC 2026'

export type BlogSection = {
  heading: string
  paragraphs: string[]
}

export type BlogPost = {
  id: string
  title: string
  author: string
  date: string
  category: BlogCategory
  excerpt: string
  sections: BlogSection[]
  tags: string[]
}
