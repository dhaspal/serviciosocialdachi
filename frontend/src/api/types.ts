/** Tipos alineados con la API FastAPI (Servicio Social). */

export type ApiCategoriaTienda = {
  id: string
  nombre: string
  descripcion?: string | null
  orden?: number | null
  activo?: boolean
}

export type ApiProducto = {
  id: string
  nombre: string
  descripcion: string
  precio: number
  sku?: string | null
  categoria: string
  stock: number
  activo: boolean
}

export type ApiPostBlog = {
  id: string
  titulo: string
  slug: string
  resumen: string
  contenido: string
  publicado: boolean
  etiquetas: string[]
  /** Si el backend expone fechas, opcional */
  creado_en?: string | null
  actualizado_en?: string | null
}

export type ApiAlbumGaleria = {
  id: string
  nombre: string
  descripcion?: string | null
  orden?: number | null
}

export type ApiItemGaleria = {
  id: string
  titulo: string
  descripcion: string
  url_imagen: string
  album: string
  orden: number
}

export type ApiAdminLoginResponse = {
  token_placeholder?: string
  access_token?: string
  token?: string
  expira?: string
  email?: string
  /** Campos extra tolerados */
  [key: string]: unknown
}

export type ApiMetricasAdmin = {
  usuarios_total?: number
  productos_total?: number
  posts_total?: number
  items_galeria_total?: number
}

export type ApiErrorBody = {
  detail?: string | unknown
}
