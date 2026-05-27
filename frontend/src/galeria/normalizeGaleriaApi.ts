import type { ApiAlbumGaleria, ApiItemGaleria } from '../api/types'

function numOrZero(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  const n = Number.parseInt(String(v ?? '0'), 10)
  return Number.isFinite(n) ? n : 0
}

/**
 * Tolera diferencias de forma en el JSON del backend (p. ej. `name` vs `nombre`).
 */
export function normalizeAlbumesGaleriaResponse(input: unknown): ApiAlbumGaleria[] {
  if (!Array.isArray(input)) return []
  const out: ApiAlbumGaleria[] = []
  for (const el of input) {
    if (!el || typeof el !== 'object') continue
    const r = el as Record<string, unknown>
    const id = String(r.id ?? '').trim()
    const nombre = String(r.nombre ?? r.name ?? r.title ?? '').trim()
    if (!id || !nombre) continue
    out.push({
      id,
      nombre,
      descripcion:
        r.descripcion === null || r.descripcion === undefined
          ? null
          : String(r.descripcion),
      orden: numOrZero(r.orden),
    })
  }
  return out
}

export function normalizeItemsGaleriaResponse(input: unknown): ApiItemGaleria[] {
  if (!Array.isArray(input)) return []
  const out: ApiItemGaleria[] = []
  for (const el of input) {
    if (!el || typeof el !== 'object') continue
    const r = el as Record<string, unknown>
    const id = String(r.id ?? '').trim()
    const titulo = String(r.titulo ?? r.title ?? '').trim()
    const album = String(
      r.album ?? r.album_name ?? r.albumNombre ?? r.album_nombre ?? '',
    ).trim()
    if (!id || !album) continue
    out.push({
      id,
      titulo,
      descripcion: String(r.descripcion ?? ''),
      url_imagen: String(r.url_imagen ?? r.urlImagen ?? '').trim(),
      album,
      orden: numOrZero(r.orden),
    })
  }
  return out
}
