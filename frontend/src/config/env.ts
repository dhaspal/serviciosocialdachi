import { INSTITUTION_FULL_NAME } from '../brand/institutionName'

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

const DEFAULT_API_BASE = 'http://localhost:8000'

/** `VITE_*` vacío en .env llega como "" y `??` no aplica el fallback. */
function envString(raw: string | undefined, fallback: string): string {
  if (raw === undefined || raw === null) return fallback
  const t = String(raw).trim()
  return t === '' ? fallback : t
}

/**
 * Origen del API (sin /api/v1). Corrige valores típicos mal copiados.
 */
function normalizeApiBaseUrl(raw: string | undefined): string {
  const trimmed =
    raw === undefined || raw === null ? '' : String(raw).trim()

  if (trimmed === '') {
    if (import.meta.env.PROD) {
      if (typeof window !== 'undefined') {
        return window.location.origin
      }
      return ''
    }
    return DEFAULT_API_BASE
  }

  const t = trimmed
  if (/^:\d+$/.test(t)) return `http://localhost${t}`
  if (/^(localhost|127\.0\.0\.1)(:\d+)?\/?$/i.test(t)) {
    return t.startsWith('http') ? trimTrailingSlash(t) : `http://${trimTrailingSlash(t)}`
  }
  return stripTrailingApiPath(trimTrailingSlash(t))
}

/** Evita `.../api/v1` en BASE + prefijo `/api/v1` → URL duplicada. */
function stripTrailingApiPath(base: string): string {
  const u = trimTrailingSlash(base)
  const dup = /\/api\/v\d+$/i
  return dup.test(u) ? u.replace(dup, '') : u
}

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback
  const v = value.toLowerCase()
  return v === '1' || v === 'true' || v === 'yes'
}

export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? INSTITUTION_FULL_NAME,
  apiBaseUrl: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
  /** Prefijo de rutas de negocio (FastAPI `API_PREFIX`). */
  apiPrefix: trimTrailingSlash(
    envString(import.meta.env.VITE_API_PREFIX, '/api/v1'),
  ),
  publicApiKey: import.meta.env.VITE_PUBLIC_API_KEY ?? '',
  enableAnalytics: parseBool(import.meta.env.VITE_ENABLE_ANALYTICS, false),
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  institutionEmail: import.meta.env.VITE_INST_EMAIL ?? '',
  institutionPhone: import.meta.env.VITE_INST_PHONE ?? '',
  institutionMobile: import.meta.env.VITE_INST_MOBILE ?? '',
  /** Número en formato internacional sin símbolos, ej. 573001234567 */
  whatsappE164: import.meta.env.VITE_INST_WHATSAPP_E164 ?? '',
  institutionAddress: import.meta.env.VITE_INST_ADDRESS ?? '',
  googleMapsEmbedUrl: import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL ?? '',
  facebookUrl: import.meta.env.VITE_FACEBOOK_URL ?? '',
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL ?? '',
  youtubeUrl: import.meta.env.VITE_YOUTUBE_URL ?? '',
} as const

export type AppEnv = typeof env
