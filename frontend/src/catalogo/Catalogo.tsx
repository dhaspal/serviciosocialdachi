import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { getCategorias, getProductos } from '../api/tienda'
import { useAdminAuth } from '../admin/AdminAuthContext'
import '../admin/AdminManage.css'
import { CatalogoAdminPanel } from './CatalogoAdminPanel'
import { CATALOGO_FILTERS, PRODUCTOS, type Producto } from './data'
import { mapApiProductoToProducto, normalizeCategoriaKey } from './mapFromApi'
import {
  catalogProductInterestMessage,
  openInstitutionWhatsApp,
} from '../config/whatsappInstitution'
import { CATALOGO_SECTION_BG } from './content'
import './Catalogo.css'

export function Catalogo() {
  const { isAuthenticated, token, logout } = useAdminAuth()
  const [filter, setFilter] = useState<string>('todos')

  const [apiProducts, setApiProducts] = useState<Producto[] | null>(null)
  const [apiFilters, setApiFilters] = useState<{ id: string; label: string }[]>(
    [],
  )
  const [apiNote, setApiNote] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const [cats, prods] = await Promise.all([
          getCategorias({ solo_activas: true, limit: 200 }),
          getProductos({ solo_activos: true, limit: 500 }),
        ])
        if (cancelled) return
        const activas = cats
          .filter((c) => c.activo !== false)
          .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
        let filtros: { id: string; label: string }[]
        if (activas.length > 0) {
          filtros = [
            { id: 'todos', label: 'Todos' },
            ...activas.map((c) => ({
              id: normalizeCategoriaKey(c.nombre),
              label: c.nombre,
            })),
          ]
        } else {
          const nombres = [...new Set(prods.map((p) => p.categoria))].sort()
          filtros = [
            { id: 'todos', label: 'Todos' },
            ...nombres.map((nombre) => ({
              id: normalizeCategoriaKey(nombre),
              label: nombre,
            })),
          ]
        }
        setApiFilters(filtros)
        setApiProducts(
          prods.map((p, i) => mapApiProductoToProducto(p, i)),
        )
        setApiNote(null)
      } catch {
        if (!cancelled) {
          setApiProducts(null)
          setApiFilters([])
          setApiNote(
            'No se pudo cargar el catálogo desde el servidor. Mostrando datos locales de demostración.',
          )
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const productSource = apiProducts !== null ? apiProducts : PRODUCTOS
  const filterSource =
    apiProducts !== null && apiFilters.length > 0 ? apiFilters : CATALOGO_FILTERS

  const list = useMemo(() => {
    if (filter === 'todos') return productSource
    return productSource.filter((p) => p.cat === filter)
  }, [filter, productSource])

  return (
    <section
      className="cat-section"
      style={
        {
          '--cat-section-bg-image': `url(${CATALOGO_SECTION_BG})`,
        } as CSSProperties
      }
    >
      <div className="cat-page layout-contained">
      {isAuthenticated ? (
        <div className="admin-banner" role="status">
          <p>
            <strong>Modo administrador</strong> — Estás editando el contenido del
            catálogo vía API.
          </p>
          <div className="admin-banner-actions">
            <button type="button" onClick={() => logout()}>
              Cerrar sesión administrador
            </button>
          </div>
        </div>
      ) : null}

      <p className="inst-section-label">Catálogo</p>
      <h2 className="inst-section-title">Productos y servicios</h2>
      <p className="cat-lead">
        Listado orientativo. Precios y disponibilidad se confirman en secretaría.
        Los datos provienen del backend cuando está disponible.
      </p>

      {apiNote ? <p className="cat-api-note">{apiNote}</p> : null}

      <div className="inst-filters" role="group" aria-label="Filtrar por categoría">
        {filterSource.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={
              id === filter
                ? 'inst-filter-pill inst-filter-pill--active'
                : 'inst-filter-pill'
            }
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="inst-product-grid">
        {list.map((p) => (
          <article key={p.id} className="inst-product-card">
            <div
              className="inst-product-img"
              style={{ background: p.accentBg }}
            >
              <span className="inst-product-tag">{p.tag}</span>
              <span
                className={
                  p.estado === 'disponible'
                    ? 'inst-product-stock inst-product-stock--ok'
                    : 'inst-product-stock inst-product-stock--out'
                }
              >
                {p.estado === 'disponible' ? 'Disponible' : 'Agotado'}
              </span>
              <span className="inst-product-initial" aria-hidden="true">
                {p.name.slice(0, 1)}
              </span>
            </div>
            <div className="inst-product-info">
              <h3 className="inst-product-name">{p.name}</h3>
              <p className="inst-product-desc">{p.desc}</p>
              <div className="inst-product-footer">
                <span className="inst-product-price">{p.price}</span>
                <button
                  type="button"
                  className="inst-product-action"
                  disabled={p.estado === 'agotado'}
                  title="Abrir WhatsApp con un mensaje sobre este producto"
                  onClick={() =>
                    openInstitutionWhatsApp(catalogProductInterestMessage(p.name))
                  }
                >
                  Solicitar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {isAuthenticated && token ? (
        <CatalogoAdminPanel token={token} />
      ) : null}
      </div>
    </section>
  )
}
