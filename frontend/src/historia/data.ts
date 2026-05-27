import { INSTITUTION_FULL_NAME } from '../brand/institutionName'

export type HistoriaHito = {
  id: string
  year: string
  badge: string
  title: string
  summary: string
  variant: 'salmon' | 'gold' | 'teal'
  imageGradient: string
}

/** Resumen visible en la línea de tiempo; el detalle ampliado está en el modal. */
export const HISTORIA_HITOS: HistoriaHito[] = [
  {
    id: '2013',
    year: '2013',
    badge: 'Origen',
    title: 'Asambleas y radicación en Risaralda',
    summary:
      'Gobernadores y líderes plantean una institución que integre cultura occidental y Emberá. Juan de Dios Queragama Nariquiaza y Uriel Queragama Cheche gestionan apoyo con la Hna. Ángela María Maya Maya; la propuesta se radica en diciembre en la Gobernación de Risaralda.',
    variant: 'salmon',
    imageGradient: 'linear-gradient(135deg,#E8553E33,#C63D2833)',
  },
  {
    id: '2014',
    year: '2014',
    badge: 'Sede',
    title: 'Centro Educativo Bachillerato en Bienestar Rural',
    summary:
      'La comunidad es acogida como sede del CEBR. El 26 de mayo inician clases con 30 estudiantes; la docente es nombrada el 29 de julio. La sede se llama Santa Teresa por la comunidad que facilitó los primeros espacios.',
    variant: 'gold',
    imageGradient: 'linear-gradient(135deg,#F0A50033,#854F0B33)',
  },
  {
    id: 'pec-nombre',
    year: '2014–2017',
    badge: 'PEC',
    title: 'Participación comunitaria y nombre institucional',
    summary:
      'Asambleas en torno al PEC con aporte de niños, jóvenes y adultos; se impulsa la educación de las mujeres y, por unanimidad de gobernadores, la futura institución se denomina Dachi Dada Kera («nuestra planta sagrada»), en honor a la planta Docimakera.',
    variant: 'teal',
    imageGradient: 'linear-gradient(135deg,#1D9E7533,#08504133)',
  },
  {
    id: '2017',
    year: '2017',
    badge: 'Gestión',
    title: 'Trámite de independencia de la sede',
    summary:
      'El 28 de julio de 2017 se radica el oficio (radicado n.° 18986). El 2 de agosto de 2017 el documento 16917 indica pertinente un centro educativo, no una I.E.; la comunidad recurre al Ministerio y se reafirma la competencia del departamento.',
    variant: 'salmon',
    imageGradient: 'linear-gradient(135deg,#E8553E22,#C63D2822)',
  },
  {
    id: '2018-2019',
    year: '2018–2019',
    badge: 'Lucha',
    title: 'Plantón, medias y primeros bachilleres',
    summary:
      'En 2018 se abre grado décimo (143 estudiantes) y el plantón educativo del 9 de julio al 9 de agosto logra compromisos con la Secretaría. En 2019 se abre grado undécimo (180 estudiantes) y se gradúan los primeros 27 bachilleres en el resguardo.',
    variant: 'gold',
    imageGradient: 'linear-gradient(135deg,#F0A50022,#854F0B22)',
  },
  {
    id: '2020',
    year: '2020',
    badge: 'Resoluciones',
    title: 'Pandemia, centro educativo e institución educativa',
    summary:
      `Reunión con el gobernador Tamayo y el secretario Gómez Franco; alternancia por COVID-19. Resolución n.° 609 (13 de marzo): Centro Educativo con sedes Iumade, Bichubara, Paparido, Mentuara, Guayabal, Kemberde y Sikuedo. El 21 de octubre, resolución n.° 1216: creación de la I.E. Dachi Dada Kera (denominación oficial vigente: ${INSTITUTION_FULL_NAME}), DANE 266572001407, 1.060 estudiantes.`,
    variant: 'teal',
    imageGradient: 'linear-gradient(135deg,#1D9E7522,#08504122)',
  },
  {
    id: '2020-nov',
    year: '2020',
    badge: 'Avales',
    title: 'Asamblea de orientación institucional',
    summary:
      'Ángela María Maya Maya, rectora; Emedelio Queragama Manugama, coordinador; Yakeline Tello Portilla, secretaria. Aval a docentes de fuera del territorio de forma provisional y reconocimiento a los docentes indígenas; avales firmados por Juan de Dios Queragama Nariquiaza y continuidad de Uriel Queragama como autoridad mayor hasta junio de 2022.',
    variant: 'salmon',
    imageGradient: 'linear-gradient(135deg,#E8553E33,#C63D2833)',
  },
  {
    id: '2021',
    year: '2021',
    badge: 'IEITA',
    title: 'Indígena, convenios y primera promoción',
    summary:
      `Convenio con la Universidad de Caldas y técnico en saneamiento ambiental (25 estudiantes de décimo). Resolución n.° 398: sede Dokabucito y escuela en La Palma. Resolución n.° 1612: incorporación de «Indígena» al nombre (trayectoria hacia la denominación oficial vigente: ${INSTITUTION_FULL_NAME}). Residencia escolar (res. 1373/2020). El 28 de octubre de 2021 se gradúan 29 bachilleres. Proyectos productivos con SENA, Secretaría y Universidad de Caldas.`,
    variant: 'gold',
    imageGradient: 'linear-gradient(135deg,#F0A50033,#854F0B33)',
  },
  {
    id: 'hoy',
    year: 'Hoy',
    badge: 'Territorio',
    title: 'Sedes y legalización',
    summary:
      `${INSTITUTION_FULL_NAME} cuenta con 8 sedes legalizadas y 2 en proceso: La Palma y Buenos Aires.`,
    variant: 'teal',
    imageGradient: 'linear-gradient(135deg,#1D9E7533,#08504133)',
  },
]
