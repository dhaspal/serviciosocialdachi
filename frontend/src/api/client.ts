import { env } from '../config/env'

/** Mensaje genérico para UI y consola: no incluye cuerpo crudo ni rutas internas del API. */
function safeHttpErrorMessage(status: number): string {
  if (status === 401 || status === 403) return 'No autorizado.'
  if (status === 404) return 'No encontrado.'
  if (status === 422) return 'Datos no válidos.'
  if (status === 408 || status === 504) return 'Tiempo de espera agotado.'
  if (status >= 500) return 'El servidor no pudo completar la solicitud.'
  return 'No se pudo completar la solicitud.'
}

function safeLoginErrorMessage(status: number): string {
  if (status === 401) return 'Credenciales incorrectas.'
  if (status === 422) return 'Verifica usuario y contraseña.'
  if (status === 429) return 'Demasiados intentos. Espera unos minutos.'
  if (status >= 500) return 'El servidor no está disponible. Intenta más tarde.'
  return 'No se pudo iniciar sesión.'
}

export function apiUrl(path: string): string {
  const base = env.apiBaseUrl + env.apiPrefix
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

function extractToken(data: Record<string, unknown>): string | null {
  const v =
    data.access_token ??
    data.token ??
    data.token_placeholder ??
    data.tokenPlaceholder
  return typeof v === 'string' && v.length > 0 ? v : null
}

export async function adminLogin(usuario: string, password: string) {
  const res = await fetch(apiUrl('/admin/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ usuario: usuario.trim(), password }),
  })
  const text = await res.text()
  let data: Record<string, unknown> = {}
  try {
    data = text ? (JSON.parse(text) as Record<string, unknown>) : {}
  } catch {
    /* ignore */
  }
  if (!res.ok) {
    throw new Error(safeLoginErrorMessage(res.status))
  }
  const token = extractToken(data)
  if (!token) {
    throw new Error('La respuesta del servidor no incluye un token de sesión.')
  }
  return { token, raw: data }
}

export type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  token?: string | null
}

export async function apiFetch<T>(
  path: string,
  { token, body, headers, ...rest }: FetchOptions = {},
): Promise<T> {
  const h = new Headers(headers)
  h.set('Accept', 'application/json')
  if (body !== undefined && body !== null) {
    h.set('Content-Type', 'application/json')
  }
  if (token) {
    h.set('Authorization', `Bearer ${token}`)
  }
  const res = await fetch(apiUrl(path), {
    ...rest,
    headers: h,
    body:
      body === undefined || body === null
        ? undefined
        : typeof body === 'string'
          ? body
          : JSON.stringify(body),
  })
  if (res.status === 204) {
    return undefined as T
  }
  const text = await res.text()
  let parsed: unknown = null
  try {
    parsed = text ? JSON.parse(text) : null
  } catch {
    parsed = text
  }
  if (!res.ok) {
    throw new Error(safeHttpErrorMessage(res.status))
  }
  return parsed as T
}
