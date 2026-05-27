export type CatalogoCategoria =
  | 'todos'
  | 'uniformes'
  | 'materiales'
  | 'libros'
  | 'servicios'

export type ProductoEstado = 'disponible' | 'agotado'

export type Producto = {
  id: string
  name: string
  desc: string
  price: string
  tag: string
  /** Clave para filtros (coincide con `id` del filtro; puede venir de la API). */
  cat: string
  accentBg: string
  estado: ProductoEstado
}

export const CATALOGO_FILTERS: { id: CatalogoCategoria; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'uniformes', label: 'Uniformes' },
  { id: 'materiales', label: 'Materiales' },
  { id: 'libros', label: 'Libros' },
  { id: 'servicios', label: 'Servicios' },
]

export const PRODUCTOS: Producto[] = [
  {
    id: 'c1',
    name: 'Uniforme diario (conjunto)',
    desc: 'Prenda institucional bordada, tallas disponibles en secretaría.',
    price: '$185.000',
    tag: 'Uniformes',
    cat: 'uniformes',
    accentBg: '#fff0e6',
    estado: 'disponible',
  },
  {
    id: 'c2',
    name: 'Kit escolar básico',
    desc: 'Cuadernos, lápices y regla según lista oficial del grado.',
    price: '$92.000',
    tag: 'Materiales',
    cat: 'materiales',
    accentBg: '#eaf0fa',
    estado: 'disponible',
  },
  {
    id: 'c3',
    name: 'Antología de lectura local',
    desc: 'Textos curados con enfoque intercultural y lengua propia.',
    price: '$48.000',
    tag: 'Libros',
    cat: 'libros',
    accentBg: '#e6f5ee',
    estado: 'disponible',
  },
  {
    id: 'c4',
    name: 'Taller de música (semestre)',
    desc: 'Instrumentos comunitarios y práctica grupal dos veces por semana.',
    price: '$120.000',
    tag: 'Servicios',
    cat: 'servicios',
    accentBg: '#fffaed',
    estado: 'disponible',
  },
  {
    id: 'c5',
    name: 'Uniforme deportivo',
    desc: 'Indumentaria para educación física y encuentros escolares.',
    price: '$95.000',
    tag: 'Uniformes',
    cat: 'uniformes',
    accentBg: '#f5eaf0',
    estado: 'agotado',
  },
  {
    id: 'c6',
    name: 'Mochila institucional',
    desc: 'Resistente al agua, compartimento para tablet o cuadernos.',
    price: '$110.000',
    tag: 'Materiales',
    cat: 'materiales',
    accentBg: '#e8f4fc',
    estado: 'disponible',
  },
]
