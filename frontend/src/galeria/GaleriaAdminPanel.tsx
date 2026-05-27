import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import {
  deleteAlbum,
  deleteItem,
  getAlbumes,
  getItems,
  postAlbum,
  postGaleriaItemSubirImagen,
  postItem,
  putAlbum,
  putItem,
} from '../api/galeriaApi'
import type { ApiAlbumGaleria, ApiItemGaleria } from '../api/types'
import {
  normalizeAlbumesGaleriaResponse,
  normalizeItemsGaleriaResponse,
} from './normalizeGaleriaApi'
import { resolveGalleryImageUrl } from './data'
import '../admin/AdminManage.css'

const MAX_BYTES_IMAGEN_GALERIA = 5 * 1024 * 1024
/** Incluye `image/jpg` (algunos SO) y tipos estándar del backend. */
const MIME_IMAGEN_GALERIA = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
])
const NOMBRE_ARCHIVO_IMAGEN_GALERIA = /\.(jpe?g|png|gif|webp)$/i

function archivoImagenGaleriaValido(f: File): boolean {
  if (MIME_IMAGEN_GALERIA.has(f.type)) return true
  if (!f.type && NOMBRE_ARCHIVO_IMAGEN_GALERIA.test(f.name)) return true
  return false
}

type Props = {
  token: string
}

export function GaleriaAdminPanel({ token }: Props) {
  const [albumes, setAlbumes] = useState<ApiAlbumGaleria[]>([])
  const [items, setItems] = useState<ApiItemGaleria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const [alNombre, setAlNombre] = useState('')
  const [alDesc, setAlDesc] = useState('')
  const [alOrden, setAlOrden] = useState('0')
  const [editAlId, setEditAlId] = useState<string | null>(null)

  const [itTitulo, setItTitulo] = useState('')
  const [itDesc, setItDesc] = useState('')
  /** Archivo nuevo elegido por el usuario (se sube al guardar). */
  const [itArchivo, setItArchivo] = useState<File | null>(null)
  /** URL de imagen ya en el servidor (ítem en edición sin cambiar archivo). */
  const [itUrlServidor, setItUrlServidor] = useState('')
  const [previewObjUrl, setPreviewObjUrl] = useState<string | null>(null)
  const [fileInputKey, setFileInputKey] = useState(0)
  const [itAlbum, setItAlbum] = useState('')
  const [itOrden, setItOrden] = useState('0')
  const [editItId, setEditItId] = useState<string | null>(null)
  const [itemSaving, setItemSaving] = useState(false)
  /** Avisos del formulario de ítem junto al botón (el toolbar puede quedar fuera de vista al hacer scroll). */
  const [itemFieldError, setItemFieldError] = useState<string | null>(null)
  const itemFeedbackRef = useRef<HTMLParagraphElement | null>(null)

  const albumesOrdenados = useMemo(
    () => [...albumes].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)),
    [albumes],
  )

  const albumItActualExiste = useMemo(
    () => albumes.some((a) => a.nombre === itAlbum.trim()),
    [albumes, itAlbum],
  )

  const refresh = useCallback(async () => {
    setError(null)
    setItemFieldError(null)
    setLoading(true)
    try {
      const [a, i] = await Promise.all([
        getAlbumes({ limit: 400 }),
        getItems({ limit: 1200 }),
      ])
      setAlbumes(normalizeAlbumesGaleriaResponse(a as unknown))
      setItems(normalizeItemsGaleriaResponse(i as unknown))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar la galería.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    if (albumes.length > 0 && !itAlbum.trim()) {
      setItAlbum(albumes[0].nombre)
    }
  }, [albumes, itAlbum])

  useEffect(() => {
    if (!itemFieldError) return
    itemFeedbackRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }, [itemFieldError])

  useEffect(() => {
    if (!itArchivo) {
      setPreviewObjUrl(null)
      return
    }
    const u = URL.createObjectURL(itArchivo)
    setPreviewObjUrl(u)
    return () => {
      URL.revokeObjectURL(u)
    }
  }, [itArchivo])

  const imagenPreviewSrc =
    previewObjUrl ??
    (itUrlServidor ? resolveGalleryImageUrl(itUrlServidor) : '')

  const flash = (msg: string) => {
    setNotice(msg)
    window.setTimeout(() => setNotice(null), 3500)
  }

  const resetAl = () => {
    setAlNombre('')
    setAlDesc('')
    setAlOrden('0')
    setEditAlId(null)
  }

  const resetIt = () => {
    setItTitulo('')
    setItDesc('')
    setItArchivo(null)
    setItUrlServidor('')
    setItOrden('0')
    setEditItId(null)
    setItemFieldError(null)
    setFileInputKey((k) => k + 1)
    if (albumes[0]) setItAlbum(albumes[0].nombre)
  }

  const onImagenArchivo = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setItemFieldError(null)
    const f = e.target.files?.[0]
    if (!f) return
    if (!archivoImagenGaleriaValido(f)) {
      const msg =
        'Usá JPEG, PNG, WebP o GIF (máx. 5 MB). Si ya es uno de esos formatos, renombrá el archivo con la extensión correcta.'
      setError(msg)
      setItemFieldError(msg)
      return
    }
    if (f.size > MAX_BYTES_IMAGEN_GALERIA) {
      const msg = 'La imagen supera el tamaño máximo permitido (5 MB).'
      setError(msg)
      setItemFieldError(msg)
      return
    }
    setItArchivo(f)
  }

  const onAlbumSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setItemFieldError(null)
    if (!alNombre.trim()) {
      setError('Indica el nombre del álbum.')
      return
    }
    const orden = Number.parseInt(alOrden, 10)
    try {
      const body = {
        nombre: alNombre.trim(),
        descripcion: alDesc.trim() || undefined,
        orden: Number.isFinite(orden) ? orden : 0,
      }
      if (editAlId) {
        await putAlbum(token, editAlId, body)
        flash('Álbum actualizado.')
      } else {
        await postAlbum(token, body)
        flash('Álbum creado.')
      }
      resetAl()
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar álbum.')
    }
  }

  const onItemFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    void submitItem()
  }

  const submitItem = async () => {
    setError(null)
    setItemFieldError(null)
    if (!itTitulo.trim()) {
      const msg = 'Indica un título para la foto.'
      setError(msg)
      setItemFieldError(msg)
      return
    }
    if (!itDesc.trim()) {
      const msg = 'Indica una descripción.'
      setError(msg)
      setItemFieldError(msg)
      return
    }
    const orden = Number.parseInt(itOrden, 10)
    if (!Number.isFinite(orden)) {
      const msg = 'Orden inválido.'
      setError(msg)
      setItemFieldError(msg)
      return
    }
    if (!itAlbum.trim()) {
      const msg = 'Elegí un álbum en la lista.'
      setError(msg)
      setItemFieldError(msg)
      return
    }
    if (!itArchivo && !itUrlServidor.trim()) {
      const msg =
        'Seleccioná una imagen con el botón «Elegir archivo». La vista previa sola no alcanza si el archivo no se cargó bien.'
      setError(msg)
      setItemFieldError(msg)
      return
    }
    setItemSaving(true)
    try {
      let urlImagen = itUrlServidor.trim()
      if (itArchivo) {
        const subida = await postGaleriaItemSubirImagen(token, itArchivo)
        urlImagen = subida.url
      }
      const body = {
        titulo: itTitulo.trim(),
        descripcion: itDesc.trim(),
        url_imagen: urlImagen,
        album: itAlbum.trim(),
        orden,
      }
      if (editItId) {
        await putItem(token, editItId, body)
        flash('Ítem actualizado.')
      } else {
        await postItem(token, body)
        flash('Ítem creado.')
      }
      resetIt()
      await refresh()
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al guardar ítem.'
      setError(msg)
      setItemFieldError(msg)
    } finally {
      setItemSaving(false)
    }
  }

  const startEditAl = (a: ApiAlbumGaleria) => {
    setEditAlId(a.id)
    setAlNombre(a.nombre)
    setAlDesc(a.descripcion ?? '')
    setAlOrden(String(a.orden ?? 0))
  }

  const startEditIt = (it: ApiItemGaleria) => {
    setEditItId(it.id)
    setItTitulo(it.titulo)
    setItDesc(it.descripcion ?? '')
    setItArchivo(null)
    setItUrlServidor(it.url_imagen)
    setItAlbum(it.album)
    setItOrden(String(it.orden))
    setItemFieldError(null)
    setFileInputKey((k) => k + 1)
  }

  return (
    <section className="admin-manage" aria-labelledby="gal-admin-title">
      <p className="admin-manage-kicker">Panel</p>
      <h2 id="gal-admin-title" className="admin-manage-title">
        Galería
      </h2>
      <div className="admin-manage-toolbar">
        <button
          type="button"
          className="admin-mini-btn"
          onClick={() => void refresh()}
          disabled={loading}
        >
          {loading ? 'Actualizando…' : 'Recargar'}
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
            {editAlId ? 'Editar álbum' : 'Nuevo álbum'}
          </legend>
          <form className="admin-form-stack" noValidate onSubmit={onAlbumSubmit}>
            <label className="admin-label-sm">
              Nombre del álbum
              <input
                value={alNombre}
                onChange={(e) => setAlNombre(e.target.value)}
              />
            </label>
            <label className="admin-label-sm">
              Descripción (opcional)
              <textarea value={alDesc} onChange={(e) => setAlDesc(e.target.value)} />
            </label>
            <label className="admin-label-sm">
              Orden
              <input
                inputMode="numeric"
                value={alOrden}
                onChange={(e) => setAlOrden(e.target.value)}
              />
            </label>
            <div className="admin-btn-row">
              <button type="submit" className="admin-mini-btn admin-mini-btn--primary">
                {editAlId ? 'Guardar álbum' : 'Crear álbum'}
              </button>
              {editAlId ? (
                <button type="button" className="admin-mini-btn" onClick={resetAl}>
                  Cancelar edición
                </button>
              ) : null}
            </div>
          </form>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Álbum</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {albumes.map((a) => (
                  <tr key={a.id}>
                    <td>{a.nombre}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-mini-btn"
                        onClick={() => startEditAl(a)}
                      >
                        Editar
                      </button>{' '}
                      <button
                        type="button"
                        className="admin-mini-btn admin-mini-btn--danger"
                        onClick={() => {
                          if (!window.confirm(`¿Eliminar álbum «${a.nombre}»?`)) return
                          void (async () => {
                            try {
                              await deleteAlbum(token, a.id)
                              flash('Álbum eliminado.')
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
            {editItId ? 'Editar foto / ítem' : 'Nuevo ítem de galería'}
          </legend>
          <form
            className="admin-form-stack"
            noValidate
            onSubmit={onItemFormSubmit}
          >
            <label className="admin-label-sm">
              Título
              <input
                value={itTitulo}
                onChange={(e) => setItTitulo(e.target.value)}
              />
            </label>
            <label className="admin-label-sm">
              Descripción
              <textarea
                value={itDesc}
                onChange={(e) => setItDesc(e.target.value)}
              />
            </label>
            <div className="admin-label-sm">
              <span>Imagen</span>
              <input
                key={fileInputKey}
                className="admin-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={onImagenArchivo}
              />
              {imagenPreviewSrc ? (
                <div className="admin-imagen-preview-wrap">
                  <img
                    className="admin-imagen-preview"
                    src={imagenPreviewSrc}
                    alt=""
                  />
                  <button
                    type="button"
                    className="admin-mini-btn"
                    onClick={() => {
                      setItArchivo(null)
                      setItUrlServidor('')
                      setItemFieldError(null)
                      setFileInputKey((k) => k + 1)
                    }}
                  >
                    Quitar imagen
                  </button>
                </div>
              ) : null}
            </div>
            <div className="admin-label-sm admin-gallery-album-field">
              <span className="admin-gallery-album-label" id="gal-album-label">
                Álbum
              </span>
              <p className="admin-gallery-album-hint" id="gal-album-hint">
                Elegí un álbum de la lista para evitar errores de escritura.
              </p>
              {loading ? (
                <p className="admin-gallery-album-loading" role="status">
                  Cargando álbumes…
                </p>
              ) : albumes.length === 0 ? (
                <p className="admin-gallery-album-empty" role="status">
                  No hay álbumes. Creá uno en el panel de la izquierda antes de
                  añadir fotos.
                </p>
              ) : (
                <div
                  className="admin-gallery-album-pick"
                  role="radiogroup"
                  aria-labelledby="gal-album-label"
                  aria-describedby="gal-album-hint"
                >
                  {itAlbum.trim() && !albumItActualExiste ? (
                    <button
                      key="__orphan-album__"
                      type="button"
                      role="radio"
                      aria-checked="true"
                      disabled
                      className="admin-gallery-album-chip admin-gallery-album-chip--orphan"
                      title="Este nombre ya no coincide con un álbum del servidor"
                    >
                      {itAlbum.trim()}
                      <span className="admin-gallery-album-chip-note">
                        {' '}
                        (no listado)
                      </span>
                    </button>
                  ) : null}
                  {albumesOrdenados.map((a) => {
                    const selected = itAlbum.trim() === a.nombre
                    return (
                      <button
                        key={a.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        className={
                          selected
                            ? 'admin-gallery-album-chip admin-gallery-album-chip--active'
                            : 'admin-gallery-album-chip'
                        }
                        onClick={() => setItAlbum(a.nombre)}
                      >
                        {a.nombre}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            <label className="admin-label-sm">
              Orden dentro del álbum
              <input
                inputMode="numeric"
                value={itOrden}
                onChange={(e) => setItOrden(e.target.value)}
              />
            </label>
            {itemFieldError ? (
              <p
                ref={itemFeedbackRef}
                className="admin-item-form-alert admin-manage-msg admin-manage-msg--err"
                role="alert"
              >
                {itemFieldError}
              </p>
            ) : null}
            <div className="admin-btn-row">
              <button
                type="button"
                className="admin-mini-btn admin-mini-btn--primary"
                disabled={itemSaving}
                onClick={() => void submitItem()}
              >
                {itemSaving
                  ? 'Guardando…'
                  : editItId
                    ? 'Guardar ítem'
                    : 'Añadir ítem'}
              </button>
              {editItId ? (
                <button
                  type="button"
                  className="admin-mini-btn"
                  onClick={resetIt}
                  disabled={itemSaving}
                >
                  Cancelar edición
                </button>
              ) : null}
            </div>
          </form>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ítem</th>
                  <th>Álbum</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.titulo}</td>
                    <td>{it.album}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-mini-btn"
                        onClick={() => startEditIt(it)}
                      >
                        Editar
                      </button>{' '}
                      <button
                        type="button"
                        className="admin-mini-btn admin-mini-btn--danger"
                        onClick={() => {
                          if (!window.confirm(`¿Eliminar «${it.titulo}»?`)) return
                          void (async () => {
                            try {
                              await deleteItem(token, it.id)
                              flash('Ítem eliminado.')
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
