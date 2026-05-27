import type { ApiProducto } from '../api/types'
import type { Producto, ProductoEstado } from './data'

const ACCENT_BGS = [
  '#fff0e6',
  '#eaf0fa',
  '#e6f5ee',
  '#fffaed',
  '#f5eaf0',
  '#e8f4fc',
]

export function normalizeCategoriaKey(nombre: string) {
  return nombre.trim().toLowerCase().replace(/\s+/g, '-')
}

export function mapApiProductoToProducto(p: ApiProducto, index: number): Producto {
  const estado: ProductoEstado =
    p.activo && p.stock > 0 ? 'disponible' : 'agotado'
  const cat = normalizeCategoriaKey(p.categoria)
  const priceFmt = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(p.precio)
  return {
    id: p.id,
    name: p.nombre,
    desc: p.descripcion,
    price: priceFmt,
    tag: p.categoria,
    cat,
    accentBg: ACCENT_BGS[index % ACCENT_BGS.length],
    estado,
  }
}
