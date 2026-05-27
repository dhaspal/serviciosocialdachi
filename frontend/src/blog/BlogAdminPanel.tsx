import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  deleteBlogPost,
  getPosts,
  postBlogPost,
  putBlogPost,
} from '../api/blogApi'
import type { ApiPostBlog } from '../api/types'
import '../admin/AdminManage.css'

type Props = {
  token: string
}

function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function BlogAdminPanel({ token }: Props) {
  const [posts, setPosts] = useState<ApiPostBlog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const [titulo, setTitulo] = useState('')
  const [slug, setSlug] = useState('')
  const [resumen, setResumen] = useState('')
  const [contenido, setContenido] = useState('')
  const [publicado, setPublicado] = useState(true)
  const [etiquetasRaw, setEtiquetasRaw] = useState('')
  const [editId, setEditId] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const list = await getPosts({ limit: 500 })
      setPosts(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar posts.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const flash = (msg: string) => {
    setNotice(msg)
    window.setTimeout(() => setNotice(null), 3500)
  }

  const resetForm = () => {
    setTitulo('')
    setSlug('')
    setResumen('')
    setContenido('')
    setPublicado(true)
    setEtiquetasRaw('')
    setEditId(null)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const etiquetas = etiquetasRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const slugFinal = (slug.trim() || slugify(titulo)).trim()
    if (!slugFinal) {
      setError('El slug no puede quedar vacío.')
      return
    }
    try {
      const body = {
        titulo: titulo.trim(),
        slug: slugFinal,
        resumen: resumen.trim(),
        contenido: contenido.trim(),
        publicado,
        etiquetas,
      }
      if (editId) {
        await putBlogPost(token, editId, body)
        flash('Entrada actualizada.')
      } else {
        await postBlogPost(token, body)
        flash('Entrada creada.')
      }
      resetForm()
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar.')
    }
  }

  const startEdit = (p: ApiPostBlog) => {
    setEditId(p.id)
    setTitulo(p.titulo)
    setSlug(p.slug)
    setResumen(p.resumen)
    setContenido(p.contenido)
    setPublicado(p.publicado)
    setEtiquetasRaw((p.etiquetas ?? []).join(', '))
  }

  return (
    <section className="admin-manage" aria-labelledby="blog-admin-title">
      <p className="admin-manage-kicker">Panel</p>
      <h2 id="blog-admin-title" className="admin-manage-title">
        Gestión del blog (API)
      </h2>
      <div className="admin-manage-toolbar">
        <button
          type="button"
          className="admin-mini-btn"
          onClick={() => void refresh()}
          disabled={loading}
        >
          {loading ? 'Cargando…' : 'Recargar entradas'}
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
            {editId ? 'Editar entrada' : 'Nueva entrada'}
          </legend>
          <form className="admin-form-stack" onSubmit={onSubmit}>
            <label className="admin-label-sm">
              Título
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                onBlur={() => {
                  if (!slug.trim() && titulo.trim()) setSlug(slugify(titulo))
                }}
                required
              />
            </label>
            <label className="admin-label-sm">
              Slug (único en el blog)
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="se-genera-del-titulo"
              />
            </label>
            <label className="admin-label-sm">
              Resumen
              <textarea
                value={resumen}
                onChange={(e) => setResumen(e.target.value)}
                required
                rows={3}
              />
            </label>
            <label className="admin-label-sm">
              Contenido (párrafos separados con línea en blanco)
              <textarea
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                required
                rows={10}
              />
            </label>
            <label className="admin-label-sm">
              Etiquetas (separadas por coma)
              <input
                value={etiquetasRaw}
                onChange={(e) => setEtiquetasRaw(e.target.value)}
                placeholder="Noticias, PEC, comunidad"
              />
            </label>
            <label className="admin-label-sm">
              Publicado
              <select
                value={publicado ? 'sí' : 'no'}
                onChange={(e) => setPublicado(e.target.value === 'sí')}
              >
                <option value="sí">Sí (visible en listado público)</option>
                <option value="no">No (borrador)</option>
              </select>
            </label>
            <div className="admin-btn-row">
              <button type="submit" className="admin-mini-btn admin-mini-btn--primary">
                {editId ? 'Guardar cambios' : 'Publicar entrada'}
              </button>
              {editId ? (
                <button type="button" className="admin-mini-btn" onClick={resetForm}>
                  Cancelar edición
                </button>
              ) : null}
            </div>
          </form>
        </fieldset>

        <fieldset className="admin-manage-fieldset">
          <legend className="admin-manage-legend">Entradas en el servidor</legend>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Estado</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.titulo}</td>
                    <td>{p.publicado ? 'Publicado' : 'Borrador'}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-mini-btn"
                        onClick={() => startEdit(p)}
                      >
                        Editar
                      </button>{' '}
                      <button
                        type="button"
                        className="admin-mini-btn admin-mini-btn--danger"
                        onClick={() => {
                          if (!window.confirm(`¿Eliminar «${p.titulo}»?`)) return
                          void (async () => {
                            try {
                              await deleteBlogPost(token, p.id)
                              flash('Entrada eliminada.')
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
