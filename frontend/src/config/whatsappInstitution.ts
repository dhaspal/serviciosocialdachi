import { env } from './env'

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Dígitos del WhatsApp institucional para `wa.me`.
 * Prioriza `VITE_INST_WHATSAPP_E164`; si no, `VITE_INST_MOBILE`.
 */
export function institutionWhatsappDigits(): string {
  if (env.whatsappE164) return digitsOnly(env.whatsappE164)
  if (env.institutionMobile) return digitsOnly(env.institutionMobile)
  return ''
}

export function openInstitutionWhatsApp(prefilledText: string): void {
  const wa = institutionWhatsappDigits()
  const q = encodeURIComponent(prefilledText)
  const url = wa
    ? `https://wa.me/${wa}?text=${q}`
    : `https://wa.me/?text=${q}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

/** Mensaje prellenado para solicitar un artículo del catálogo por nombre. */
export function catalogProductInterestMessage(productName: string): string {
  return `hola estoy interesado en obtener uno de sus articulos el cual se llama ${productName}`
}
