import { env } from '../config/env'

/**
 * Convierte la URL guardada en el ítem en una URL usable en `<img src>`.
 * - Absolutas (`http(s):`) se devuelven tal cual.
 * - Rutas absolutas en el servidor (`/uploads/...`) se anteponen `VITE_API_BASE_URL`
 *   (origen del API, sin `/api/v1`), porque el front suele correr en otro puerto/host.
 */
export function resolveGalleryImageUrl(
  urlFromApi: string | undefined | null,
): string {
  const u = urlFromApi?.trim() ?? ''
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  if (u.startsWith('//')) {
    if (typeof globalThis !== 'undefined' && 'location' in globalThis) {
      const loc = (
        globalThis as unknown as { location?: { protocol?: string } }
      ).location
      if (loc?.protocol) return `${loc.protocol}${u}`
    }
    return `https:${u}`
  }
  if (u.startsWith('/')) {
    const base = env.apiBaseUrl.replace(/\/+$/, '')
    return `${base}${u}`
  }
  return u
}

/** Clave estable para emparejar `item.album` con `album.nombre` (mayúsculas / espacios). */
export function normalizeGaleriaAlbumKey(name: string): string {
  return name.trim().toLocaleLowerCase('es')
}

export type GaleriaFoto = {
  id: string
  title: string
  gradient: string
  /** URL de la imagen (solo contenido publicado en el servidor). */
  imageUrl?: string
}

export type GaleriaAlbum = {
  id: string
  name: string
  date: string
  description: string
  photos: GaleriaFoto[]
}
