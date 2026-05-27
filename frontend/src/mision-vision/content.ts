/** Textos institucionales: formación, misión, visión, filosofía y marco normativo. */

import { INSTITUTION_FULL_NAME } from '../brand/institutionName'

export const NOMBRE_INSTITUCION = INSTITUTION_FULL_NAME

export type PhilosophyCardId =
  | 'formar'
  | 'mision'
  | 'vision'
  | 'filosofia'
  | 'objetivo'
  | 'objetivos'
  | 'marco'

export type PhilosophyCardMeta = {
  id: PhilosophyCardId
  title: string
  summary: string
  /** Etiqueta breve sobre el título en el modal */
  modalEyebrow: string
  /** Frase de apertura amigable en el modal */
  modalIntro: string
}

/** Imagen de fondo de la página (Valle del Cocora); archivo en /public */
export const MISION_SECTION_BG = `${import.meta.env.BASE_URL}mision-section-bg.jpg`

export const PHILOSOPHY_CARDS: PhilosophyCardMeta[] = [
  {
    id: 'formar',
    title: '¿Qué queremos formar?',
    summary:
      'Hombres y mujeres (Katios y Katias) y una sociedad Katia fundamentada en la Ley de Origen, la identidad, el territorio y el trabajo colectivo.',
    modalEyebrow: 'Identidad, territorio y futuro',
    modalIntro:
      'Aquí encontrarás cómo imaginamos a las personas y a la sociedad que defendemos desde la escuela y la comunidad.',
  },
  {
    id: 'mision',
    title: 'Nuestra misión en el territorio',
    summary:
      'Educación integral en producción agropecuaria sostenible y agroindustrial, desde la ruralidad y la cosmovisión Embera Katio en Kemberde, Gito Dokabu.',
    modalEyebrow: 'Lo que hacemos cada día',
    modalIntro:
      'El compromiso concreto de la institución con las familias y el resguardo, en palabras claras.',
  },
  {
    id: 'vision',
    title: 'Hacia dónde miramos',
    summary:
      'Ser referente en el sector educativo rural agropecuario indígena en Risaralda, con respuesta comunitaria y bases de la cosmovisión Embera Katio.',
    modalEyebrow: 'Horizonte colectivo',
    modalIntro:
      'Una mirada de largo plazo: calidad, pertenencia y respuesta a lo que la comunidad necesita.',
  },
  {
    id: 'filosofia',
    title: 'Filosofía que nos guía',
    summary:
      'Formar personas autónomas que, desde el pasado, la cosmovisión embera y el presente, participen en la construcción del futuro comunitario.',
    modalEyebrow: 'Raíces y presente',
    modalIntro:
      'Cómo entendemos la formación cuando el pasado, la cultura y el hoy caminan juntos.',
  },
  {
    id: 'objetivo',
    title: 'Objetivo etnoeducativo central',
    summary:
      'Proceso integral desde la ley de origen hacia la permanencia del pueblo indígena, con cultivo crítico, amor por la tierra y compromiso de la comunidad educativa.',
    modalEyebrow: 'Ley de origen y pervivencia',
    modalIntro:
      'La brújula general del proyecto: tierra, reflexión y compromiso de toda la comunidad educativa.',
  },
  {
    id: 'objetivos',
    title: 'Siete metas que nos organizan',
    summary:
      'Siete líneas: saber y cosmovisión, interculturalidad, investigación, autonomía, hábitos de estudio, espíritu crítico y valores culturales.',
    modalEyebrow: 'Pasos concretos',
    modalIntro:
      'Objetivos específicos alineados con el derecho propio y la vida del resguardo.',
  },
  {
    id: 'marco',
    title: 'Marco legal que nos respalda',
    summary:
      'Decreto 1953 de 2014 (SEIP) y Decreto 3011 de 1997: educación propia, autonomía, calendario y modalidad semipresencial.',
    modalEyebrow: 'Derecho y normativa',
    modalIntro:
      'Los instrumentos que fortalecen la educación propia y la autonomía pedagógica.',
  },
]

export const FORMAR_KATIOS_KATIAS: string[] = [
  'Respetuosos y dispuestos a asumir la práctica de la Ley de Origen y persistentes en la defensa de los principios culturales del pueblo Katio.',
  'Responsables para cumplir con su papel en la vida y en el trabajo colectivo.',
  'Humildes para armonizarse con la naturaleza, con la sociedad misma y formar una familia.',
  'Con una identidad definida, que reconozcan su origen y sus raíces, teniendo como base los conocimientos, principios y valores propios; que se identifiquen, participen y sientan los procesos culturales, orgullosos de ser Katios desde la casa y las escuelas.',
  'Que tengan sentido de pertenencia, que conozcan y defiendan el territorio, y promuevan la unidad y la solidaridad.',
  'Buenos y buenas trabajadoras y trabajadores, que tengan capacidad de resistencia y enseñen con el ejemplo.',
  'Enamorados por lo interno, críticos y pensantes para formar una sociedad de buenos valores para afianzar y fortalecer los procesos organizativos y culturales.',
  'Integrales e interculturales para desempeñarse en todos los ámbitos sociales.',
  'Que conserven y socialicen lo aprendido para mejorar la vida de la comunidad.',
  'Que conozcan la realidad interna y el contexto nacional en cuanto a la legislación indígena.',
  'Competentes en los conocimientos propios, académicos y agropecuarios.',
]

export const UNA_SOCIEDAD_KATIA = `Conformada por familias Katias cuyas relaciones estén basadas en el respeto mutuo, el amor, la identidad, el conocimiento e interés colectivos. Que sea una sociedad libre pero bien fundamentada en la identidad y la defensa del saber propio y la tradición; respetando, aprendiendo, enseñando y practicando la Ley de Origen, siendo conscientes de la búsqueda de armonía entre el hombre y la naturaleza y entre la comunidad misma, estrechando los lazos de solidaridad que ya existen y alimentando los valores propios y el fortalecimiento real de nuestro gobierno. Una sociedad Katia orgullosa de su procedencia, con un alto grado de liderazgo desde el punto de vista crítico, pero que de igual manera sea comprensiva y tolerante. Además, que sea capaz de auto sostenerse para garantizar la permanencia etnofísica y cultural del pueblo indígena Katio.`

export const MISION = `${NOMBRE_INSTITUCION.toUpperCase()}, ubicada en la comunidad indígena de Kemberde, resguardo Gito Dokabu, Pueblo Rico – Risaralda, bajo el concepto de la ruralidad y la cosmovisión del pueblo embera Katio ofrece a los niños, niñas, jóvenes y adultos, una educación integral, con el fin de desarrollar capacidades en la producción agropecuaria sostenible y agroindustrial alimentaria, con aplicación de metodologías y estrategias vivenciales, el apoyo de las nuevas tecnologías, que conduzcan a la construcción de escenarios de equidad y diversidad; partiendo del trabajo comunitario y el aporte significativo de los mayores y mayoras del pueblo embera Katio.`

export const VISION = `${NOMBRE_INSTITUCION.toUpperCase()} se verá a largo plazo como una de las mejores en el sector educativo rural agropecuario indígena del departamento de Risaralda, capaz de dar respuesta con calidad y eficacia a las nuevas exigencias comunitarias, organizativas y tecnológicas que la realidad social actual demande a la población indígena del resguardo Gito Dokabu, teniendo como referente los procesos institucionales y las bases culturales que parten de la cosmovisión y el plan de vida del pueblo indígena Embera Katio.`

export const FILOSOFIA = `Formar personas autónomas, que tomando como base las experiencias del pasado, la cosmovisión de su cultura embera y la realidad del presente participen activamente y con responsabilidad en la construcción del futuro y luchen porque la continuidad de su autoconstrucción y su cultura redunde no solo en su progreso personal sino también en el progreso y desarrollo del medio comunitario y agropecuario en el cual les corresponde interactuar.`

export const OBJETIVO_GENERAL = `El proyecto de la ${NOMBRE_INSTITUCION} es un proceso integral que desde la ley de origen, derecho mayor o derecho propio se propone contribuir a la permanencia y pervivencia del pueblo indígena (Decreto 1953 del 7 de octubre de 2014), cultivando la actividad crítica, el amor por la tierra, la agricultura y el espíritu investigativo en los educandos, a su vez comprometiendo la comunidad educativa en un proceso de reflexión y acción orientada a construir su intencionalidad pedagógica y educativa en donde aprendan a plantearse interrogantes serios frente a los problemas tanto sociales como políticos que aquejan sus comunidades.`

export const OBJETIVOS_ESPECIFICOS: string[] = [
  'Construir y fortalecer espacios de saber desde la cosmovisión del pueblo indígena (Decreto 1953 del 7 de octubre de 2014).',
  'Promover una educación que reconozca y profundice los valores étnicos y culturales de cada grupo humano, aceptando y respetando la diferencia como fundamento de las relaciones interétnicas (Decreto 1953 del 7 de octubre de 2014).',
  'Desarrollar procesos de investigación que contribuyan a la producción, revitalización, valoración de los saberes, prácticas y conocimientos propios y a su interacción con otros saberes y conocimientos.',
  'Aportar al fortalecimiento de la autonomía y de las estructuras de gobierno propio del pueblo indígena (Decreto 1953 del 7 de octubre de 2014).',
  'Fomentar los hábitos de estudio e investigación en los educandos que los lleve a la autoafirmación personal y grupal, valorando su capacidad creadora y la responsabilidad.',
  'Motivar el espíritu crítico, analítico y reflexivo de los educandos frente a su propia realidad y del entorno social, comprometiéndose así en la transformación de los mismos.',
  'Potenciar en los jóvenes los valores propios de la cultura: solidaridad, paz, sentido comunitario, respeto a las autoridades, unidad, apoyo en los convites comunitarios, el sentido de familia; contribuyendo así al control social de las comunidades.',
]

export const MARCO_DECRETO_PARRAFO_1 = `El proyecto de la ${NOMBRE_INSTITUCION} se teje a partir del Decreto 1953 del 7 de octubre de 2014 (SEIP: sistema educativo indígena propio), donde se define la educación propia como un proceso de formación integral colectiva cuya finalidad es el rescate y fortalecimiento de la identidad cultural, territorialidad y autonomía del pueblo indígena, representado en sus valores, lengua nativa, saberes y conocimientos y prácticas propias en relación de saberes y conocimientos interculturales.`

export const MARCO_DECRETO_PARRAFO_2 = `El proyecto de la ${NOMBRE_INSTITUCION} se apropia de los derechos que hacen parte de este proceso educativo: derecho de autonomía para organizar las áreas fundamentales (artículos 3 y 9, Decreto 3011 de diciembre de 1997), el calendario académico de acuerdo con la situación y posibilidades del estudiante con modalidad semipresencial (art. 19, Decreto 3011), que permita a los estudiantes compartir proyectos y conocimientos adquiridos con sus comunidades a través de trabajos que van realizando.`
