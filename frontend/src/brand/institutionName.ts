/** Nombre oficial de la institución (única fuente para textos y UI). */
export const INSTITUTION_FULL_NAME =
  'Institución Educativa Indígena Técnica Agropecuaria Dachi Dada Kera' as const

/** Sigla usada en marca (navegación, titulares cortos). */
export const INSTITUTION_ACRONYM = 'IEITA' as const

/** Nombre propio del territorio / planta (sin la sigla). */
export const INSTITUTION_COMMUNITY_NAME = 'Dachi Dada Kera' as const

/** Marca corta en una sola línea (sigla + nombre propio). */
export const INSTITUTION_SHORT_BRAND_NAME =
  `${INSTITUTION_ACRONYM} ${INSTITUTION_COMMUNITY_NAME}` as const
