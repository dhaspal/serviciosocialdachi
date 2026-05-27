import type { SectionId } from '../sections/types'

/** Fondo de página Inicio (parallax); archivo en /public — usa BASE_URL por si el sitio no está en la raíz */
export const HOME_PARALLAX_BG = `${import.meta.env.BASE_URL}home-parallax-bg.jpg`

export type SliderSlide = {
  id: string
  title: string
  subtitle: string
  ctaLabel: string
  target: SectionId
  /** Imagen en /public */
  photoUrl: string
  /** Degradado encima de la foto para legibilidad del texto */
  overlay: string
}

export const SLIDES: SliderSlide[] = [
  {
    id: 's1',
    title: 'Identidad, lengua y futuro en comunidad',
    subtitle:
      'Educación intercultural Embera Chamí con excelencia académica y participación familiar.',
    ctaLabel: 'Ubicación y contacto',
    target: 'ubicacion',
    photoUrl: '/home-slide-identidad.jpg',
    overlay:
      'linear-gradient(135deg, rgba(232, 85, 62, 0.55) 0%, rgba(198, 61, 40, 0.5) 40%, rgba(44, 24, 16, 0.88) 100%)',
  },
  {
    id: 's2',
    title: 'Noticias y vida institucional',
    subtitle:
      'Comunicados oficiales, eventos y logros de nuestra comunidad educativa.',
    ctaLabel: 'Ir al blog',
    target: 'blog',
    photoUrl: '/home-slide-noticias.jpg',
    overlay:
      'linear-gradient(135deg, rgba(29, 158, 117, 0.45) 0%, rgba(8, 80, 65, 0.5) 45%, rgba(44, 24, 16, 0.88) 100%)',
  },
  {
    id: 's3',
    title: 'Catálogo de productos y servicios',
    subtitle:
      'Uniformes, materiales y servicios extracurriculares con apoyo a la comunidad.',
    ctaLabel: 'Abrir catálogo',
    target: 'catalogo',
    photoUrl: '/home-slide-catalogo.jpg',
    overlay:
      'linear-gradient(135deg, rgba(240, 165, 0, 0.45) 0%, rgba(186, 117, 23, 0.55) 45%, rgba(44, 24, 16, 0.9) 100%)',
  },
]

export type HomeSpotChip = {
  id: string
  label: string
  hint: string
  accent: 'salmon' | 'teal' | 'gold' | 'blue'
}

/** Franja superior de datos rápidos (dinámico por datos, no por tiempo) */
export const HOME_SPOT_CHIPS: HomeSpotChip[] = [
  {
    id: 'c1',
    label: 'Matrícula y admisión',
    hint: 'Cupos, documentos y seguimiento',
    accent: 'salmon',
  },
  {
    id: 'c2',
    label: 'Jornada escolar',
    hint: 'Intensidad única y acompañamiento',
    accent: 'teal',
  },
  {
    id: 'c3',
    label: 'Lengua y cultura',
    hint: 'Embera Chamí en el currículo',
    accent: 'gold',
  },
  {
    id: 'c4',
    label: 'Familia y territorio',
    hint: 'Participación y proyectos comunitarios',
    accent: 'blue',
  },
]

export type HomeBentoRole = 'mission' | 'schedule' | 'levels' | 'culture' | 'family'

export type HomeBentoTile = {
  id: string
  role: HomeBentoRole
  title: string
  body: string
  foot?: string
}

export const HOME_BENTO_TILES: HomeBentoTile[] = [
  {
    id: 'b1',
    role: 'mission',
    title: 'Nuestra misión',
    body:
      'Formar personas íntegras con sentido de pertenencia cultural, competencias para la vida y compromiso con el territorio, articulando saberes Embera Chamí con una educación de calidad.',
    foot: 'Educación pública con identidad propia.',
  },
  {
    id: 'b2',
    role: 'schedule',
    title: 'Horario de atención',
    body:
      'Secretaría y dirección: lunes a viernes 7:00 a.m. – 1:00 p.m. y 2:00 – 5:00 p.m. Se recomienda agendar visitas.',
    foot: 'Citas previas para reuniones con docentes.',
  },
  {
    id: 'b3',
    role: 'levels',
    title: 'Niveles y modalidad',
    body:
      'Educación preescolar, básica y media en modalidad escolarizada, con itinerarios que fortalecen lectura, matemáticas, ciencias y proyecto de vida.',
    foot: 'Aulas multigrado donde aplica.',
  },
  {
    id: 'b4',
    role: 'culture',
    title: 'Interculturalidad viva',
    body:
      'Espacios para lengua, música, tejido y oralidad; encuentros con sabedores y proyectos que visibilizan la cultura Embera Chamí.',
    foot: 'Convivencia y respeto como eje.',
  },
  {
    id: 'b5',
    role: 'family',
    title: 'Familia en la escuela',
    body:
      'Comités de padres, mesas de trabajo y canal directo con orientación escolar para seguimiento académico y bienestar.',
    foot: 'Transparencia en comunicados y agenda.',
  },
]

export type HomeTrack = {
  id: string
  name: string
  summary: string
  tags: string[]
}

export const HOME_TRACKS: HomeTrack[] = [
  {
    id: 't1',
    name: 'Primera infancia y básica',
    summary:
      'Lectoescritura inicial, pensamiento matemático y exploración del entorno con juego y trabajo colaborativo.',
    tags: ['Preescolar', 'Primaria'],
  },
  {
    id: 't2',
    name: 'Formación integral',
    summary:
      'Ciudadanía, tecnología con propósito, arte y deporte como espacios de expresión y hábitos saludables.',
    tags: ['Currículo', 'Proyectos'],
  },
  {
    id: 't3',
    name: 'Proyección y comunidad',
    summary:
      'Orientación vocacional, prácticas de servicio y vínculos con organizaciones del territorio.',
    tags: ['Media', 'Territorio'],
  },
]

export type HomeStatItem = {
  id: string
  value: string
  label: string
  ariaLabel: string
}

export const HOME_STATS: HomeStatItem[] = [
  {
    id: 'st1',
    value: '28',
    label: 'Años de historia',
    ariaLabel: '28 años de historia institucional',
  },
  {
    id: 'st2',
    value: '+120',
    label: 'Estudiantes',
    ariaLabel: 'Más de 120 estudiantes matriculados',
  },
  {
    id: 'st3',
    value: '+340',
    label: 'Egresados',
    ariaLabel: 'Más de 340 egresados',
  },
]
