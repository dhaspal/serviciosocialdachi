/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_API_PREFIX?: string
  readonly VITE_PUBLIC_API_KEY?: string
  readonly VITE_ENABLE_ANALYTICS?: string
  readonly VITE_INST_EMAIL?: string
  readonly VITE_INST_PHONE?: string
  readonly VITE_INST_MOBILE?: string
  readonly VITE_INST_WHATSAPP_E164?: string
  readonly VITE_INST_ADDRESS?: string
  readonly VITE_GOOGLE_MAPS_EMBED_URL?: string
  readonly VITE_FACEBOOK_URL?: string
  readonly VITE_INSTAGRAM_URL?: string
  readonly VITE_YOUTUBE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
