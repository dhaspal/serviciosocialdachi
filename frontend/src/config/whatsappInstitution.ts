import { INSTITUTION_CONTACT } from '../brand/institutionContact'

export function institutionWhatsappDigits(): string {
  return INSTITUTION_CONTACT.telefonoDigits
}

export function openInstitutionWhatsApp(prefilledText: string): void {
  const wa = institutionWhatsappDigits()
  const q = encodeURIComponent(prefilledText)
  const url = `https://wa.me/${wa}?text=${q}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

/** Mensaje prellenado para solicitar un artículo del catálogo por nombre. */
export function catalogProductInterestMessage(productName: string): string {
  return `hola estoy interesado en obtener uno de sus articulos el cual se llama ${productName}`
}
