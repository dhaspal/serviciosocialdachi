import { apiFetch, apiUrl } from './client'
import type { ApiAlbumGaleria, ApiItemGaleria } from './types'

/** Respuesta de POST /galeria/items/subir-imagen */
export type GaleriaSubirImagenResponse = {
  url: string
  ruta_publica?: string
  nombre_archivo?: string
}

/**
 * Sube un archivo al servidor (multipart, campo `imagen`).
 * No usa `apiFetch` porque el cuerpo debe ser FormData sin Content-Type fijado a JSON.
 */
export async function postGaleriaItemSubirImagen(
  token: string,
  file: File,
): Promise<GaleriaSubirImagenResponse> {
  const form = new FormData()
  form.append('imagen', file)

  const headers = new Headers()
  headers.set('Accept', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(apiUrl('/galeria/items/subir-imagen'), {
    method: 'POST',
    headers,
    body: form,
  })

  const text = await res.text()
  let parsed: unknown = null
  try {
    parsed = text ? JSON.parse(text) : null
  } catch {
    parsed = null
  }

  if (!res.ok) {
    if (res.status === 413) {
      throw new Error('La imagen supera el tamaño máximo permitido (5 MB).')
    }
    if (res.status === 400) {
      throw new Error(
        'Formato no permitido. Usá JPEG, PNG, WebP o GIF de hasta 5 MB.',
      )
    }
    if (res.status === 401 || res.status === 403) {
      throw new Error('No autorizado.')
    }
    if (res.status >= 500) {
      throw new Error('El servidor no pudo guardar la imagen.')
    }
    throw new Error('No se pudo subir la imagen.')
  }

  const obj = parsed as Record<string, unknown> | null
  const url =
    typeof obj?.url === 'string' && obj.url.trim().length > 0
      ? obj.url.trim()
      : null
  if (!url) {
    throw new Error('El servidor no devolvió la URL de la imagen.')
  }

  return {
    url,
    ruta_publica:
      typeof obj?.ruta_publica === 'string' ? obj.ruta_publica : undefined,
    nombre_archivo:
      typeof obj?.nombre_archivo === 'string' ? obj.nombre_archivo : undefined,
  }
}

export async function getAlbumes(opts?: { skip?: number; limit?: number }) {
  const q = new URLSearchParams()
  if (opts?.skip !== undefined) q.set('skip', String(opts.skip))
  if (opts?.limit !== undefined) q.set('limit', String(opts.limit))
  const qs = q.toString()
  return apiFetch<ApiAlbumGaleria[]>(
    `/galeria/albumes${qs ? `?${qs}` : ''}`,
  )
}

export async function getItems(opts?: {
  album?: string
  skip?: number
  limit?: number
}) {
  const q = new URLSearchParams()
  if (opts?.album) q.set('album', opts.album)
  if (opts?.skip !== undefined) q.set('skip', String(opts.skip))
  if (opts?.limit !== undefined) q.set('limit', String(opts.limit))
  const qs = q.toString()
  return apiFetch<ApiItemGaleria[]>(`/galeria/items${qs ? `?${qs}` : ''}`)
}

export async function postAlbum(
  token: string,
  body: { nombre: string; descripcion?: string; orden?: number },
) {
  return apiFetch<ApiAlbumGaleria>('/galeria/albumes', {
    method: 'POST',
    body,
    token,
  })
}

export async function putAlbum(
  token: string,
  id: string,
  body: { nombre: string; descripcion?: string; orden?: number },
) {
  return apiFetch<ApiAlbumGaleria>(`/galeria/albumes/${id}`, {
    method: 'PUT',
    body,
    token,
  })
}

export async function patchAlbum(
  token: string,
  id: string,
  body: Partial<{ nombre: string; descripcion: string; orden: number }>,
) {
  return apiFetch<ApiAlbumGaleria>(`/galeria/albumes/${id}`, {
    method: 'PATCH',
    body,
    token,
  })
}

export async function deleteAlbum(token: string, id: string) {
  return apiFetch<void>(`/galeria/albumes/${id}`, {
    method: 'DELETE',
    token,
  })
}

export async function postItem(
  token: string,
  body: {
    titulo: string
    descripcion: string
    url_imagen: string
    album: string
    orden: number
  },
) {
  return apiFetch<ApiItemGaleria>('/galeria/items', {
    method: 'POST',
    body,
    token,
  })
}

export async function putItem(
  token: string,
  id: string,
  body: {
    titulo: string
    descripcion: string
    url_imagen: string
    album: string
    orden: number
  },
) {
  return apiFetch<ApiItemGaleria>(`/galeria/items/${id}`, {
    method: 'PUT',
    body,
    token,
  })
}

export async function patchItem(
  token: string,
  id: string,
  body: Partial<{
    titulo: string
    descripcion: string
    url_imagen: string
    album: string
    orden: number
  }>,
) {
  return apiFetch<ApiItemGaleria>(`/galeria/items/${id}`, {
    method: 'PATCH',
    body,
    token,
  })
}

export async function deleteItem(token: string, id: string) {
  return apiFetch<void>(`/galeria/items/${id}`, {
    method: 'DELETE',
    token,
  })
}
