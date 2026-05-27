import { INSTITUTION_FULL_NAME } from '../brand/institutionName'

export type PerfilRequerimiento = 'rector' | 'coordinador' | 'docente' | 'educando'

export type PerfilId = PerfilRequerimiento | 'orientacion'

export type PerfilEquipo = {
  id: PerfilId
  name: string
  role: string
  area: string
  summary: string
  variant: 'salmon' | 'teal' | 'gold' | 'violet' | 'sage'
  /** Si está definido, se muestra el botón Requerimientos */
  requerimientos?: PerfilRequerimiento
}

export const PERFILES_EQUIPO: PerfilEquipo[] = [
  {
    id: 'rector',
    name: 'María Fernanda Londoño',
    role: 'Rectora',
    area: 'Dirección general',
    summary:
      'Autoridad académica y administrativa de la ' +
      INSTITUTION_FULL_NAME +
      '; representa a la institución ante el resguardo Gito Dokabu, el gobierno propio y las entidades del Estado, en el marco de la legislación indígena y nacional.',
    variant: 'salmon',
    requerimientos: 'rector',
  },
  {
    id: 'coordinador',
    name: 'Carlos Andrés Murillo',
    role: 'Coordinador de educación',
    area: 'Gestión curricular y sedes',
    summary:
      'Coordina los procesos educativos en las sedes de la institución etnoeducativa, articula estadísticas, acompañamiento pedagógico y el vínculo entre gobierno interno y secretarías.',
    variant: 'teal',
    requerimientos: 'coordinador',
  },
  {
    id: 'orientacion',
    name: 'Lucía Pereira',
    role: 'Orientadora escolar',
    area: 'Acompañamiento integral',
    summary:
      'Acompañamiento psicosocial a estudiantes y familias, rutas de atención y articulación con el equipo directivo y la comunidad.',
    variant: 'gold',
  },
  {
    id: 'docente',
    name: 'Cuerpo docente',
    role: 'Docentes',
    area: 'Aula y territorio',
    summary:
      'Personas que acompañan el proceso etnoeducativo en aula y comunidad, con compromiso por la cultura Katio, la ley de origen y la calidad pedagógica.',
    variant: 'violet',
    requerimientos: 'docente',
  },
  {
    id: 'educando',
    name: 'Estudiantes',
    role: 'Educando',
    area: 'Comunidad educativa',
    summary:
      'Niñas, niños, jóvenes y adultos que participan del proyecto institucional desde la cosmovisión Ébéra, el territorio y la ley de origen.',
    variant: 'sage',
    requerimientos: 'educando',
  },
]
