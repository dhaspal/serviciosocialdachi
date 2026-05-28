/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_API_PREFIX?: string
  readonly VITE_PUBLIC_API_KEY?: string
  readonly VITE_ENABLE_ANALYTICS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
