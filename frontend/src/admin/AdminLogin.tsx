import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { SectionId } from '../sections/types'
import { useAdminAuth } from './AdminAuthContext'
import './AdminLogin.css'

type Props = {
  onNavigate: (id: SectionId) => void
}

export function AdminLogin({ onNavigate }: Props) {
  const { isAuthenticated, login, logout } = useAdminAuth()
  const [usuarioInput, setUsuarioInput] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const cerrarSesion = () => {
    logout()
    setUsuarioInput('')
    setPassword('')
    setError(null)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const usuario = usuarioInput.trim()
    if (!usuario || !password) {
      setError('Indique usuario y contraseña.')
      return
    }
    setLoading(true)
    try {
      await login(usuario, password)
      setPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated) {
    return (
      <div className="admin-page layout-contained">
        <div className="admin-card admin-panel">
          <p className="admin-kicker">Panel</p>
          <h1 className="admin-title">Sesión iniciada</h1>
          <div className="admin-actions">
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={() => onNavigate('catalogo')}
            >
              Catálogo
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => onNavigate('blog')}
            >
              Blog
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => onNavigate('galeria')}
            >
              Galería
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => onNavigate('inicio')}
            >
              Inicio
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page layout-contained">
      <div className="admin-card">
        <p className="admin-kicker">Administración</p>
        <h1 className="admin-title">Inicio de sesión</h1>

        <form className="admin-form" onSubmit={onSubmit} noValidate autoComplete="off">
          <label className="admin-label" htmlFor="admin-usuario">
            Usuario
            <input
              id="admin-usuario"
              className="admin-input"
              type="text"
              name="admin-usuario"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              value={usuarioInput}
              onChange={(e) => setUsuarioInput(e.target.value)}
            />
          </label>
          <label className="admin-label" htmlFor="admin-password">
            Contraseña
            <input
              id="admin-password"
              className="admin-input"
              type="password"
              name="admin-password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error ? <p className="admin-error">{error}</p> : null}

          <div className="admin-actions">
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={loading}
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => onNavigate('inicio')}
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
