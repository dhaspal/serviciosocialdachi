import { apiFetch } from './client'
import type { ApiCategoriaTienda, ApiProducto } from './types'

export async function getCategorias(opts?: {
  solo_activas?: boolean
  skip?: number
  limit?: number
}) {
  const q = new URLSearchParams()
  if (opts?.solo_activas !== undefined)
    q.set('solo_activas', String(opts.solo_activas))
  if (opts?.skip !== undefined) q.set('skip', String(opts.skip))
  if (opts?.limit !== undefined) q.set('limit', String(opts.limit))
  const qs = q.toString()
  return apiFetch<ApiCategoriaTienda[]>(
    `/tienda/categorias${qs ? `?${qs}` : ''}`,
  )
}

export async function getProductos(opts?: {
  categoria?: string
  solo_activos?: boolean
  skip?: number
  limit?: number
}) {
  const q = new URLSearchParams()
  if (opts?.categoria) q.set('categoria', opts.categoria)
  if (opts?.solo_activos !== undefined)
    q.set('solo_activos', String(opts.solo_activos))
  if (opts?.skip !== undefined) q.set('skip', String(opts.skip))
  if (opts?.limit !== undefined) q.set('limit', String(opts.limit))
  const qs = q.toString()
  return apiFetch<ApiProducto[]>(
    `/tienda/productos${qs ? `?${qs}` : ''}`,
  )
}

export async function postCategoria(
  token: string,
  body: {
    nombre: string
    descripcion?: string
    orden?: number
    activo?: boolean
  },
) {
  return apiFetch<ApiCategoriaTienda>('/tienda/categorias', {
    method: 'POST',
    body,
    token,
  })
}

export async function putCategoria(
  token: string,
  id: string,
  body: {
    nombre: string
    descripcion?: string
    orden?: number
    activo?: boolean
  },
) {
  return apiFetch<ApiCategoriaTienda>(`/tienda/categorias/${id}`, {
    method: 'PUT',
    body,
    token,
  })
}

export async function patchCategoria(
  token: string,
  id: string,
  body: Partial<{
    nombre: string
    descripcion: string
    orden: number
    activo: boolean
  }>,
) {
  return apiFetch<ApiCategoriaTienda>(`/tienda/categorias/${id}`, {
    method: 'PATCH',
    body,
    token,
  })
}

export async function deleteCategoria(token: string, id: string) {
  return apiFetch<void>(`/tienda/categorias/${id}`, {
    method: 'DELETE',
    token,
  })
}

export async function postProducto(
  token: string,
  body: {
    nombre: string
    descripcion: string
    precio: number
    sku?: string
    categoria: string
    stock: number
    activo: boolean
  },
) {
  return apiFetch<ApiProducto>('/tienda/productos', {
    method: 'POST',
    body,
    token,
  })
}

export async function putProducto(
  token: string,
  id: string,
  body: {
    nombre: string
    descripcion: string
    precio: number
    sku?: string
    categoria: string
    stock: number
    activo: boolean
  },
) {
  return apiFetch<ApiProducto>(`/tienda/productos/${id}`, {
    method: 'PUT',
    body,
    token,
  })
}

export async function patchProducto(
  token: string,
  id: string,
  body: Partial<{
    nombre: string
    descripcion: string
    precio: number
    sku: string
    categoria: string
    stock: number
    activo: boolean
  }>,
) {
  return apiFetch<ApiProducto>(`/tienda/productos/${id}`, {
    method: 'PATCH',
    body,
    token,
  })
}

export async function deleteProducto(token: string, id: string) {
  return apiFetch<void>(`/tienda/productos/${id}`, {
    method: 'DELETE',
    token,
  })
}
