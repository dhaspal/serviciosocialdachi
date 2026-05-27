import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { adminLogin as apiAdminLogin } from '../api/client'

const STORAGE_TOKEN = 'ie_dachi_admin_token'
const STORAGE_EMAIL = 'ie_dachi_admin_email'

type AdminAuthState = {
  token: string | null
  email: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthState | null>(null)

function readStoredSession(): { token: string | null; email: string | null } {
  try {
    const token = sessionStorage.getItem(STORAGE_TOKEN)
    const email = sessionStorage.getItem(STORAGE_EMAIL)
    return {
      token: token && token.length > 0 ? token : null,
      email: email && email.length > 0 ? email : null,
    }
  } catch {
    return { token: null, email: null }
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const initial = readStoredSession()
  const [token, setToken] = useState<string | null>(initial.token)
  const [email, setEmail] = useState<string | null>(initial.email)

  const persist = useCallback((t: string | null, e: string | null) => {
    try {
      if (t) sessionStorage.setItem(STORAGE_TOKEN, t)
      else sessionStorage.removeItem(STORAGE_TOKEN)
      if (e) sessionStorage.setItem(STORAGE_EMAIL, e)
      else sessionStorage.removeItem(STORAGE_EMAIL)
    } catch {
      /* ignore */
    }
    setToken(t)
    setEmail(e)
  }, [])

  const login = useCallback(
    async (userEmail: string, password: string) => {
      const { token: newToken } = await apiAdminLogin(userEmail, password)
      persist(newToken, userEmail.trim())
    },
    [persist],
  )

  const logout = useCallback(() => {
    persist(null, null)
  }, [persist])

  const value = useMemo(
    () =>
      ({
        token,
        email,
        isAuthenticated: Boolean(token),
        login,
        logout,
      }) satisfies AdminAuthState,
    [token, email, login, logout],
  )

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth(): AdminAuthState {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) {
    throw new Error('useAdminAuth debe usarse dentro de AdminAuthProvider')
  }
  return ctx
}
