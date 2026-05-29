import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  deleteCategoria,
  deleteProducto,
  getCategorias,
  getProductos,
  postCategoria,
  postProducto,
  putCategoria,
  putProducto,
} from '../api/tienda'
import type { ApiCategoriaTienda, ApiProducto } from '../api/types'
import { mergeCategoriaNombres } from './categoriasMerge'
import '../admin/AdminManage.css'

type Props = {
  token: string
}

export function CatalogoAdminPanel({ token }: Props) {
  const [categorias, setCategorias] = useState<ApiCategoriaTienda[]>([])
  const [productos, setProductos] = useState<ApiProducto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const [catNombre, setCatNombre] = useState('')
  const [catDesc, setCatDesc] = useState('')
  const [catOrden, setCatOrden] = useState('0')
  const [catActivo, setCatActivo] = useState(true)
  const [editCatId, setEditCatId] = useState<string | null>(null)

  const [pNombre, setPNombre] = useState('')
  const [pDesc, setPDesc] = useState('')
  const [pPrecio, setPPrecio] = useState('')
  const [pSku, setPSku] = useState('')
  const [pCategoria, setPCategoria] = useState('')
  const [pStock, setPStock] = useState('0')
  const [pActivo, setPActivo] = useState(true)
  const [editProdId, setEditProdId] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const [c, p] = await Promise.all([
        getCategorias({ limit: 500 }),
        getProductos({ limit: 500 }),
      ])
      setCategorias(c)
      setProductos(p)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar el catálogo.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const categoriaOpciones = useMemo(() => {
    const merged = mergeCategoriaNombres(categorias, productos)
    if (pCategoria.trim() && !merged.includes(pCategoria)) {
      return [pCategoria, ...merged]
    }
    return merged
  }, [categorias, productos, pCategoria])

  useEffect(() => {
    if (editProdId || categoriaOpciones.length === 0) return
    if (!pCategoria.trim() || !categoriaOpciones.includes(pCategoria)) {
      setPCategoria(categoriaOpciones[0])
    }
  }, [categoriaOpciones, editProdId, pCategoria])

  const flash = (msg: string) => {
    setNotice(msg)
    window.setTimeout(() => setNotice(null), 3500)
  }

  const resetCatForm = () => {
    setCatNombre('')
    setCatDesc('')
    setCatOrden('0')
    setCatActivo(true)
    setEditCatId(null)
  }

  const resetProdForm = () => {
    setPNombre('')
    setPDesc('')
    setPPrecio('')
    setPSku('')
    setPStock('0')
    setPActivo(true)
    setEditProdId(null)
    if (categoriaOpciones[0]) setPCategoria(categoriaOpciones[0])
  }

  const onSaveCategoria = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const orden = Number.parseInt(catOrden, 10)
      const body = {
        nombre: catNombre.trim(),
        descripcion: catDesc.trim() || undefined,
        orden: Number.isFinite(orden) ? orden : 0,
        activo: catActivo,
      }
      const nombreGuardado = body.nombre
      if (editCatId) {
        await putCategoria(token, editCatId, body)
        flash('Categoría actualizada.')
        setPCategoria(nombreGuardado)
      } else {
        await postCategoria(token, body)
        flash('Categoría creada. Ya puede usarla en «Nuevo producto».')
        setPCategoria(nombreGuardado)
      }
      resetCatForm()
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar categoría.')
    }
  }

  const onSaveProducto = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const precio = Number.parseFloat(pPrecio.replace(',', '.'))
    const stock = Number.parseInt(pStock, 10)
    if (!Number.isFinite(precio) || precio < 0) {
      setError('Precio inválido.')
      return
    }
    if (!Number.isFinite(stock) || stock < 0) {
      setError('Stock inválido.')
      return
    }
    if (!pCategoria.trim()) {
      setError('Seleccione o escriba una categoría.')
      return
    }
    try {
      const body = {
        nombre: pNombre.trim(),
        descripcion: pDesc.trim(),
        precio,
        sku: pSku.trim() || undefined,
        categoria: pCategoria.trim(),
        stock,
        activo: pActivo,
      }
      if (editProdId) {
        await putProducto(token, editProdId, body)
        flash('Producto actualizado.')
      } else {
        await postProducto(token, body)
        flash('Producto creado.')
      }
      resetProdForm()
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar producto.')
    }
  }

  const startEditCat = (c: ApiCategoriaTienda) => {
    setEditCatId(c.id)
    setCatNombre(c.nombre)
    setCatDesc(c.descripcion ?? '')
    setCatOrden(String(c.orden ?? 0))
    setCatActivo(c.activo !== false)
  }

  const startEditProd = (p: ApiProducto) => {
    setEditProdId(p.id)
    setPNombre(p.nombre)
    setPDesc(p.descripcion)
    setPPrecio(String(p.precio))
    setPSku(p.sku ?? '')
    setPCategoria(p.categoria)
    setPStock(String(p.stock))
    setPActivo(p.activo)
  }

  return (
    <section className="admin-manage" aria-labelledby="catalogo-admin-title">
      <p className="admin-manage-kicker">Panel</p>
      <h2 id="catalogo-admin-title" className="admin-manage-title">
        Gestión de catálogo (API)
      </h2>
      <div className="admin-manage-toolbar">
        <button
          type="button"
          className="admin-mini-btn"
          onClick={() => void refresh()}
          disabled={loading}
        >
          {loading ? 'Actualizando…' : 'Recargar datos'}
        </button>
        {notice ? (
          <p className="admin-manage-msg admin-manage-msg--ok">{notice}</p>
        ) : null}
        {error ? (
          <p className="admin-manage-msg admin-manage-msg--err">{error}</p>
        ) : null}
      </div>

      <div className="admin-manage-grid admin-manage-grid--2">
        <fieldset className="admin-manage-fieldset">
          <legend className="admin-manage-legend">
            {editCatId ? 'Editar categoría' : 'Nueva categoría'}
          </legend>
          <form className="admin-form-stack" onSubmit={onSaveCategoria}>
            <label className="admin-label-sm">
              Nombre
              <input
                value={catNombre}
                onChange={(e) => setCatNombre(e.target.value)}
                required
              />
            </label>
            <label className="admin-label-sm">
              Descripción (opcional)
              <textarea value={catDesc} onChange={(e) => setCatDesc(e.target.value)} />
            </label>
            <div className="admin-form-row admin-form-row--2">
              <label className="admin-label-sm">
                Orden
                <input
                  inputMode="numeric"
                  value={catOrden}
                  onChange={(e) => setCatOrden(e.target.value)}
                />
              </label>
              <label className="admin-label-sm">
                Activa
                <select
                  value={catActivo ? 'sí' : 'no'}
                  onChange={(e) => setCatActivo(e.target.value === 'sí')}
                >
                  <option value="sí">Sí</option>
                  <option value="no">No</option>
                </select>
              </label>
            </div>
            <div className="admin-btn-row">
              <button type="submit" className="admin-mini-btn admin-mini-btn--primary">
                {editCatId ? 'Guardar cambios' : 'Crear categoría'}
              </button>
              {editCatId ? (
                <button type="button" className="admin-mini-btn" onClick={resetCatForm}>
                  Cancelar edición
                </button>
              ) : null}
            </div>
          </form>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Activa</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {categorias.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nombre}</td>
                    <td>{c.activo === false ? 'No' : 'Sí'}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-mini-btn"
                        onClick={() => startEditCat(c)}
                      >
                        Editar
                      </button>{' '}
                      <button
                        type="button"
                        className="admin-mini-btn admin-mini-btn--danger"
                        onClick={() => {
                          if (
                            !window.confirm(
                              `¿Eliminar la categoría «${c.nombre}»?`,
                            )
                          )
                            return
                          void (async () => {
                            try {
                              await deleteCategoria(token, c.id)
                              flash('Categoría eliminada.')
                              await refresh()
                            } catch (err) {
                              setError(
                                err instanceof Error
                                  ? err.message
                                  : 'No se pudo eliminar.',
                              )
                            }
                          })()
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </fieldset>

        <fieldset className="admin-manage-fieldset">
          <legend className="admin-manage-legend">
            {editProdId ? 'Editar producto' : 'Nuevo producto'}
          </legend>
          <form className="admin-form-stack" onSubmit={onSaveProducto}>
            <label className="admin-label-sm">
              Nombre
              <input
                value={pNombre}
                onChange={(e) => setPNombre(e.target.value)}
                required
              />
            </label>
            <label className="admin-label-sm">
              Descripción
              <textarea
                value={pDesc}
                onChange={(e) => setPDesc(e.target.value)}
                required
              />
            </label>
            <div className="admin-form-row admin-form-row--2">
              <label className="admin-label-sm">
                Precio (número)
                <input
                  inputMode="decimal"
                  value={pPrecio}
                  onChange={(e) => setPPrecio(e.target.value)}
                  required
                />
              </label>
              <label className="admin-label-sm">
                Stock
                <input
                  inputMode="numeric"
                  value={pStock}
                  onChange={(e) => setPStock(e.target.value)}
                  required
                />
              </label>
            </div>
            <label className="admin-label-sm">
              Categoría
              <select
                value={pCategoria}
                onChange={(e) => setPCategoria(e.target.value)}
                required
                disabled={categoriaOpciones.length === 0}
              >
                {categoriaOpciones.length === 0 ? (
                  <option value="">
                    Cree una categoría o recargue los datos
                  </option>
                ) : (
                  categoriaOpciones.map((nombre) => (
                    <option key={nombre} value={nombre}>
                      {nombre}
                    </option>
                  ))
                )}
              </select>
            </label>
            <label className="admin-label-sm">
              SKU (opcional)
              <input value={pSku} onChange={(e) => setPSku(e.target.value)} />
            </label>
            <label className="admin-label-sm">
              Activo en tienda
              <select
                value={pActivo ? 'sí' : 'no'}
                onChange={(e) => setPActivo(e.target.value === 'sí')}
              >
                <option value="sí">Sí</option>
                <option value="no">No</option>
              </select>
            </label>
            <div className="admin-btn-row">
              <button type="submit" className="admin-mini-btn admin-mini-btn--primary">
                {editProdId ? 'Guardar producto' : 'Crear producto'}
              </button>
              {editProdId ? (
                <button type="button" className="admin-mini-btn" onClick={resetProdForm}>
                  Cancelar edición
                </button>
              ) : null}
            </div>
          </form>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>{p.precio}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-mini-btn"
                        onClick={() => startEditProd(p)}
                      >
                        Editar
                      </button>{' '}
                      <button
                        type="button"
                        className="admin-mini-btn admin-mini-btn--danger"
                        onClick={() => {
                          if (!window.confirm(`¿Eliminar «${p.nombre}»?`)) return
                          void (async () => {
                            try {
                              await deleteProducto(token, p.id)
                              flash('Producto eliminado.')
                              await refresh()
                            } catch (err) {
                              setError(
                                err instanceof Error
                                  ? err.message
                                  : 'No se pudo eliminar.',
                              )
                            }
                          })()
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </fieldset>
      </div>
    </section>
  )
}
