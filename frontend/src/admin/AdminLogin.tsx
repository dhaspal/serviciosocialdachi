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
  const [emailInput, setEmailInput] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const cerrarSesion = () => {
    logout()
    setEmailInput('')
    setPassword('')
    setError(null)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const mail = emailInput.trim()
    if (!mail || !password) {
      setError('Indique correo y contraseña.')
      return
    }
    setLoading(true)
    try {
      await login(mail, password)
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

        <form className="admin-form" onSubmit={onSubmit} noValidate>
          <label className="admin-label" htmlFor="admin-email">
            Correo electrónico
            <input
              id="admin-email"
              className="admin-input"
              type="email"
              name="email"
              autoComplete="username"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
          </label>
          <label className="admin-label" htmlFor="admin-password">
            Contraseña
            <input
              id="admin-password"
              className="admin-input"
              type="password"
              name="password"
              autoComplete="current-password"
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
