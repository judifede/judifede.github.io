export interface Recomendacion {
  nombre: string
  cargo: string
  empresa: string
  relacion?: string
  fecha: string
  fechaISO: string
  cita1: string
  cita2: string
  hrefLinkedIn: string
}

export const RECOMENDACION_JORGE: Recomendacion = {
  nombre: 'Jorge Mor',
  cargo: 'Desarrollador de software',
  empresa: '21ninjas',
  relacion: 'Supervisor directo',
  fecha: '17 de enero de 2025',
  fechaISO: '2025-01-17',
  cita1:
    'Diego es a nivel general un buen trabajador con buenas aptitudes para sacar el trabajo adelante, consiguiendo los objetivos previstos. Es autodidacta y tiene una buena base en programación web.',
  cita2:
    'Durante su estancia de varios meses en 21ninjas trabajó en varios proyectos web y en todos ellos demostró una gran eficacia. Sin duda aportó beneficios al equipo de trabajo.',
  hrefLinkedIn: 'https://es.linkedin.com/in/jorgemor',
}

export const recomendaciones: Recomendacion[] = [RECOMENDACION_JORGE]
