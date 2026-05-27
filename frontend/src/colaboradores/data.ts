export type Colaborador = {
  id: string
  name: string
  role: string
  photo: string
  photoFallback: string
  cvlacUrl: string
}

export const PROYECTO_NARRATIVAS = {
  title: 'Narrativas identitarias',
  subtitle: 'Proyecto UCP',
  paragraphs: [
    'El proyecto narrativas identitarias y formulación de iniciativas de innovación social de los jóvenes indígenas Pueblo Rico Risaralda (ACTUI), se propone recuperar los valores ancestrales de la comunidad Embera Katío desde la Institución Educativa Dachi Dada Kera, ubicada en el municipio de Pueblo Rico, Risaralda, corregimiento de Santa Cecilia. Este esfuerzo busca empoderar a los indígenas, disminuir la pobreza en zonas de resguardo y fomentar la conservación de los recursos naturales en áreas protegidas, partiendo de un diagnóstico que evidencia múltiples exclusiones estructurales.',
    'Entre los efectos directos identificados, se destacan la centralización de los planes decenales de educación que no contemplan las particularidades territoriales ni culturales de las comunidades indígenas, la limitada inclusión en políticas internacionales sobre alfabetización, y el desconocimiento sociopolítico sobre el significado, la función y los derechos de los resguardos. Asimismo, se observa una invisibilización de los saberes ancestrales en áreas como medicina, educación y gestión ambiental, mientras persiste una concepción de pobreza ligada al desconocimiento cultural.',
    'Las causas de esta problemática están ancladas en la falta de adaptación de los programas de alfabetización a la cosmovisión Embera Katío. Por ejemplo, los módulos CLEI 1 resultan insuficientes debido a su enfoque escrito, en contraste con la oralidad y el uso de dialectos propios de esta comunidad. La estandarización educativa ignora las particularidades lingüísticas y culturales de los pueblos indígenas, imponiendo parámetros generales del ICFES. Además, se desconoce el valor de prácticas como la minga y se promueve una evangelización sin pertinencia cultural.',
    'La comunidad también enfrenta limitaciones para comunicarse en español escrito, lo que repercute en el acceso a recursos estatales y oportunidades académicas. Incluso quienes acceden a la educación superior deben ajustarse a modelos tradicionales que excluyen los saberes propios. A esto se suma la pérdida del rol del Jaibaná como médico ancestral y la marginación de mujeres indígenas como sujetas de derechos. Las tensiones sobre el territorio son agravadas por la acción de grupos armados ilegales, terratenientes y prácticas agrícolas intensivas (como el cultivo de aguacate), que vulneran los espacios de conservación.',
  ],
} as const

export const COLABORADORES: Colaborador[] = [
  {
    id: 'jhon-wilmar-toro',
    name: 'Jhon Wilmar Toro Zapata',
    role: 'Investigador · Perfil CvLAC',
    photo: '/colaborador2.jpeg',
    photoFallback: '/colaboradores/jhon-wilmar-toro.svg',
    cvlacUrl:
      'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0001601966',
  },
  {
    id: 'alexandra-jaramillo',
    name: 'Alexandra Jaramillo Gutierrez',
    role: 'Investigadora · Perfil CvLAC',
    photo: '/Colaborador1.jpeg',
    photoFallback: '/colaboradores/alexandra-jaramillo.svg',
    cvlacUrl:
      'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0001578575',
  },
]
