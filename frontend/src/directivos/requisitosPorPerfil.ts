import { INSTITUTION_FULL_NAME } from '../brand/institutionName'
import type { PerfilRequerimiento } from './data'

export type BloqueRequisito = {
  titulo: string
  parrafos?: string[]
  viñetas?: string[]
}

export type DocumentoRequisito = {
  tituloModal: string
  referencia: string
  introduccion?: string
  bloques: BloqueRequisito[]
}

const RECTOR: DocumentoRequisito = {
  tituloModal: 'Requerimientos — Rector(a)',
  referencia: '2.6.1 El Rector(a)',
  introduccion:
    `Para el desarrollo del proceso de la ${INSTITUTION_FULL_NAME}, se requiere de un Rector(a) con las siguientes características. Debe ser idóneo, no sólo en el campo administrativo, sino en lo personal.`,
  bloques: [
    {
      titulo: 'Perfil laboral',
      viñetas: [
        'Amplio conocimiento tanto en lo educativo convencional como en lo tradicional.',
        'Estar bien preparado y tener experiencia mínima de 5 años en el campo educativo.',
        'Preparación académica en la administración educativa.',
        'Demostrar su capacidad y eficiencia en la gestión de procesos en la institución educativa.',
        'Hoja de vida intachable en el área administrativa y humana.',
        'Que ejerza autoridad dentro de la institución educativa y sea eficiente en la dirección de profesores y estudiantes.',
        'Que motive al cuerpo estudiantil a que nos apropiemos de nuestra cultura.',
        'Tener una buena relación institucional, tanto con el gobierno propio como el gobierno estatal.',
        'Que tenga una relación armoniosa con la comunidad, que respete y se adapte a las decisiones de las autoridades tradicionales.',
        'Que cumpla con las funciones establecidas en la Ley 115, la Ley 715, el Decreto 804 y el Decreto 1953 para comunidades indígenas.',
        'Que sea especialista en docencia y administración.',
        'Que tenga pleno conocimiento de la legislación educativa que compete a la educación indígena (leyes nacionales y tratados internacionales).',
        'Que tenga conocimiento de nuestro proceso, de nuestras costumbres y nuestra tradición.',
        'Tener iniciativa para realizar convenios educativos que contribuyan al mejoramiento del resguardo (universidades, capacitaciones, ciclos).',
        'Tener adecuada interlocución con las entidades educativas estatales, ya que es una de sus funciones primordiales.',
      ],
    },
    {
      titulo: 'Perfil personal',
      viñetas: [
        'Debe ser una persona idónea, íntegra y transparente.',
        'Que identifique, valore y fortalezca el proceso Katio.',
        'Que tenga sentido de pertenencia con la comunidad.',
        'Que sea líder, autónomo y democrático.',
        'Que tenga calidad humana (buenas relaciones, fluidez verbal y carisma).',
        'Que tenga criterios propios.',
        'Preferiblemente sea Katio o de otra cultura, pero que manifieste respeto por el pueblo indígena.',
        'Que goce de buena reputación dentro y fuera del resguardo.',
        'Que sea tolerante y ejemplar dentro de la comunidad.',
        'Que acate y respete los reglamentos o criterios establecidos por las autoridades.',
        'Que manifieste principios de solidaridad dentro y fuera del plantel educativo y que lidere procesos educativos.',
        'Que maneje un perfil de autoridad.',
        'Que acate los mandatos de los órganos de gobierno.',
        'Que sea reconocido dentro del territorio (resguardo).',
        'Que conozca de administración educativa y de la cultura indígena.',
        'Que sea una persona ejemplo para los demás, responsable y respetuoso(a).',
        'Que no tenga antecedentes.',
      ],
    },
    {
      titulo: 'Aval y reconocimiento',
      parrafos: [
        'El Rector(a) debe ser preferiblemente Katio o de otra cultura, pero que cuente con el aval indígena; que se reconozca en nuestros aspectos culturales y en el acatamiento del gobierno interno, del cual hace parte.',
      ],
    },
  ],
}

const COORDINADOR: DocumentoRequisito = {
  tituloModal: 'Requerimientos — Coordinador(a) de educación',
  referencia: '2.6.2 Perfil del coordinador de educación',
  introduccion:
    `Para el desarrollo del proceso de la ${INSTITUTION_FULL_NAME}, se requiere de un coordinador con las siguientes características.`,
  bloques: [
    {
      titulo: 'A nivel personal',
      viñetas: [
        'Debe ser una persona idónea, íntegra y transparente.',
        'Que identifique, valore y fortalezca el proceso Katio.',
        'Que tenga sentido de pertenencia con la comunidad.',
        'Que sea autónomo, democrático y con criterios propios.',
        'Que tenga calidad humana (buenas relaciones, fluidez verbal y carisma).',
        'Que goce de buena reputación dentro y fuera del resguardo.',
        'Que sea tolerante y ejemplar dentro de la comunidad.',
        'Que acate y respete los reglamentos o criterios establecidos por las autoridades.',
        'Que manifieste principios de solidaridad dentro y fuera del plantel educativo.',
        'Que lidere procesos educativos.',
        'Que maneje un perfil de autoridad.',
        'Que acate los mandatos de los órganos de gobierno.',
        'Que conozca de administración educativa y de la cultura.',
        'Que sea una persona ejemplo para los demás, responsable y respetuoso(a).',
        'Que no tenga antecedentes.',
        'El coordinador(a) debe ser preferiblemente Katio o de otra cultura, pero que cuente con el aval indígena; que se reconozca en nuestros aspectos culturales y en el acatamiento del gobierno interno, del cual hace parte.',
      ],
    },
    {
      titulo: 'A nivel laboral',
      viñetas: [
        'Tener una hoja de vida intachable.',
        'Que ejerza autoridad dentro de las sedes educativas.',
        'Que motive al cuerpo estudiantil a que se apropien de su cultura.',
        'Tener excelente relación dentro y fuera de la institución.',
        'Que tenga una relación armoniosa con la comunidad, que respete y siga los conductos regulares de las autoridades autóctonas.',
        'Debe tener pleno conocimiento de la labor docente y tener experiencia en esta área.',
        'Conocer plenamente la legislación indígena nacional e internacional, la legislación Katia y todas las normas educativas que rigen la educación colombiana.',
        `Debe estar a cargo del manejo de los procesos educativos de las sedes de la ${INSTITUTION_FULL_NAME} (educación formal y no formal).`,
        'Tener capacidad para la coordinación de las sedes educativas de la institución.',
      ],
    },
    {
      titulo: 'Funciones específicas del coordinador',
      viñetas: [
        'Impulsar, coordinar e implementar proyectos en las distintas sedes educativas de la institución.',
        'Promover y cristalizar la coordinación e integración de los servicios educativos en las distintas sedes de la institución.',
        'Coordinar, asesorar y controlar el proceso estadístico de la institución (matrícula, notas, cobertura).',
        'Hacer acompañamiento y seguimiento a cada una de las sedes de la institución.',
        'Organizar y evaluar el proceso educativo dentro de las sedes de la institución.',
        'Que sea el enlace entre el gobierno interno y el gobierno externo.',
        'Estar sujeto a las autoridades tradicionales en cuanto al proceso educativo.',
        'Fomentar la cultura mediante las diferentes actividades.',
      ],
    },
    {
      titulo: 'Mecanismo de selección del coordinador de educación',
      parrafos: [
        'El Coordinador de Educación será elegido de acuerdo a los parámetros establecidos por las autoridades, teniendo en cuenta que debe cumplir todos los requisitos laborales y personales que la comunidad ha acordado.',
        'Posteriormente debe presentarse la persona propuesta a la Secretaría de Educación para que ésta lo ratifique. Queda claro que por ningún motivo podrá ser propuesto por la Secretaría de Educación en tanto que debe cumplir como vocero y autoridad del pueblo Katio.',
      ],
    },
  ],
}

const DOCENTE: DocumentoRequisito = {
  tituloModal: 'Requerimientos — Docente',
  referencia: '2.6.3 Perfil del docente',
  introduccion:
    `Para el desarrollo del proceso educativo de la ${INSTITUTION_FULL_NAME}, se requiere de un docente con las siguientes características.`,
  bloques: [
    {
      titulo: 'Características del perfil',
      viñetas: [
        'Que respete las personas, valore y promueva la tradición de los pueblos como la historia, artesanía, pintura, danza, música y otras.',
        'Abierto al diálogo y a la realidad cultural.',
        'Sencillo en su forma de ser y dirigirse a la gente.',
        'Honesto consigo mismo y con los demás.',
        'Responsable, paciente y dinámico.',
        'Solidario y conciliador.',
        'Seguro de sí mismo y de su área de trabajo.',
        'De espíritu crítico e investigativo.',
        'Que tenga experiencia en el trabajo con indígenas.',
        'Comprometido con la causa del pueblo indígena.',
        'Que enseñe y se deje enseñar.',
        'Que respete y promueva los fines y principios de la etnoeducación.',
        'Creativo en la presentación de su área.',
        'Exigente en el cumplimiento de los deberes.',
        'Democrático y participativo.',
        'Puede ser licenciado de universidad; también se consideran para conocimientos específicos de la cultura Katia (música, danza, artesanía, medicina, ciclos agrícolas y otros) quienes tengan conocimiento de la educación propia.',
      ],
    },
    {
      titulo: 'Selección y vinculación de docentes dentro del territorio Katio',
      viñetas: [
        'El proceso de selección debe pasar por la consulta tradicional y la comisión de educación apoyará a los mayores exponiendo las fortalezas académicas del docente en observación.',
        'Los docentes deben tener conocimiento propio de la ley de origen y de la cultura propia del pueblo Katio, para transmitirlo a los estudiantes; y, de no ser indígenas, que tengan sentido de pertenencia y respeto por la cultura.',
        'Que el docente sea licenciado.',
        'Particularmente que el docente tenga amor por lo que hace y por la cultura donde imparte sus enseñanzas (el docente se debe acomodar a los educandos y no los educandos al docente).',
        'Disponibilidad del docente para acomodarse al calendario y a la metodología elegida por la comunidad educativa.',
      ],
    },
    {
      titulo: 'Criterios y mecanismos para la vinculación y selección de docentes',
      viñetas: [
        'Ser Katio preferiblemente o de otra cultura, pero que manifieste respeto por el pueblo indígena.',
        'Tener una licenciatura.',
        'Que trabaje por la comunidad e impulse la cultura Katia.',
        'Preferiblemente debe permanecer en el territorio.',
        'Debe ser tolerante, valorar y respetar la autoridad tradicional.',
        'Estar vinculado(a) con los procesos comunitarios.',
        'Respetar a los docentes que ya están vinculados en el resguardo.',
        'Ser avalados por las autoridades tradicionales.',
        'Que tenga buena moral y aceptación en la comunidad.',
        'Que sea investigativo, participativo y flexible.',
        'Disponibilidad para participar en diferentes eventos.',
        'Que respete los horarios y cronogramas ya existentes y organizados por la comunidad.',
      ],
    },
    {
      titulo: 'Integración de los docentes a la comunidad',
      parrafos: [
        'Los y las docentes deben tener sentido de pertenencia con la comunidad, participar activamente en los diferentes eventos que se realicen dentro y fuera de la comunidad en la que han sido asignados, aportando ideas que conlleven a una mejor relación entre la comunidad, hacer las cosas de corazón sin intereses individuales y retomar costumbres como la visita a las familias, dedicar un tiempo a la comunidad. Es preferible que no hagan cuestionarios para responder, sino ir al hogar, sin aislarse de la comunidad. Ir al trabajo cumpliendo y no convirtiendo las dificultades en rumores.',
        'Los docentes deben apropiarse más de las actividades de trabajo que se realizan en las comunidades y las escuelas, así mismo promover en la comunidad diferentes actividades en pro de su desarrollo. También deben apersonarse más de los problemas de la comunidad, ya que los docentes son líderes por naturaleza.',
        'Es también labor del docente en el resguardo inculcarles a los estudiantes el sentido de pertenencia por la cultura a partir de la iniciativa y la participación activa en el trabajo comunitario, mostrando coherencia entre el decir y el hacer, dedicando un poco más de tiempo a los estudiantes que necesitan nivelación y, ante todo, comprometerse abierta y francamente con el desarrollo de la investigación.',
      ],
    },
  ],
}

const EDUCANDO: DocumentoRequisito = {
  tituloModal: 'Requerimientos — Educando',
  referencia: '2.6.4 Perfil del educando',
  introduccion:
    `Sobre la base de la concepción del cosmos que el pueblo Ébéra tiene, el educando de la ${INSTITUTION_FULL_NAME} ha de ser una persona con las siguientes características y compromisos.`,
  bloques: [
    {
      titulo: 'Perfil y actitudes',
      viñetas: [
        'Que conozca, valore y aproveche los recursos naturales y el medio ambiente.',
        'Abierta al diálogo y a la interacción de los otros grupos humanos con los que se tiene relación.',
        'Honesta consigo misma y con los demás.',
        'Íntegra, que posibilite la relación armónica y recíproca entre las personas, su realidad social y la naturaleza.',
        'Que conozca y valore su lengua Ébéra.',
        'Autónoma, capaz de tomar decisiones, resolver problemas y desarrollar su propio proceso educativo.',
        'Con sentido comunitario, que participe en la toma de decisiones de lo que afecta o beneficia a la comunidad.',
      ],
    },
    {
      titulo: 'Asistencia, territorio y cultura',
      viñetas: [
        'Los y las estudiantes deben asistir cumplidamente a las actividades académicas, tanto en aulas como en todos aquellos espacios que ofrece su territorio y su cultura para establecer conjuntamente con los docentes la exploración y asimilación de la pedagogía específica de la ley de origen.',
        'Ser respetuoso dentro y fuera de la institución.',
        'Que porte bien el uniforme.',
        'Que cumpla con las actividades agropecuarias dentro de la institución y en sus comunidades.',
        'Que participe en las reuniones comunitarias y asambleas generales dentro de su territorio.',
        'Buena presentación personal acorde a su cultura (no tintura en el cabello, no piercing).',
      ],
    },
  ],
}

export const REQUISITOS_POR_PERFIL: Record<PerfilRequerimiento, DocumentoRequisito> = {
  rector: RECTOR,
  coordinador: COORDINADOR,
  docente: DOCENTE,
  educando: EDUCANDO,
}

export function obtenerDocumentoRequisitos(perfil: PerfilRequerimiento): DocumentoRequisito {
  return REQUISITOS_POR_PERFIL[perfil]
}
