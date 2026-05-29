import type { ApiCategoriaTienda, ApiProducto } from '../api/types'

/** Nombres únicos: catálogo administrado + categorías usadas en productos. */
export function mergeCategoriaNombres(
  categorias: ApiCategoriaTienda[],
  productos: ApiProducto[],
  opts?: { soloActivas?: boolean },
): string[] {
  const soloActivas = opts?.soloActivas ?? false
  const activas = categorias.filter((c) => !soloActivas || c.activo !== false)
  const orden = new Map<string, number>()
  activas
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0) || a.nombre.localeCompare(b.nombre, 'es'))
    .forEach((c, i) => orden.set(c.nombre.trim(), i))

  const nombres = new Set<string>()
  for (const c of activas) {
    const n = c.nombre.trim()
    if (n) nombres.add(n)
  }
  for (const p of productos) {
    const n = p.categoria.trim()
    if (n) nombres.add(n)
  }

  return [...nombres].sort((a, b) => {
    const oa = orden.get(a) ?? 9999
    const ob = orden.get(b) ?? 9999
    if (oa !== ob) return oa - ob
    return a.localeCompare(b, 'es')
  })
}
