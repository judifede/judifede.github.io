export interface Recomendacion {
  nombre: string
  cargo: string
  empresa: string
  relacion?: string
  citas: string[]
  hrefLinkedIn: string
}

export const RECOMENDACION_JORGE: Recomendacion = {
  nombre: 'Jorge Mor',
  cargo: 'Desarrollador de software',
  empresa: '21ninjas',
  relacion: 'Supervisor directo',
  citas: [
    'Diego es a nivel general un buen trabajador con buenas aptitudes para sacar el trabajo adelante, consiguiendo los objetivos previstos. Es autodidacta y tiene una buena base en programación web.',
    'Durante su estancia de varios meses en 21ninjas trabajó en varios proyectos web y en todos ellos demostró una gran eficacia. Sin duda aportó beneficios al equipo de trabajo.',
  ],
  hrefLinkedIn: 'https://es.linkedin.com/in/jorgemor',
}

export const RECOMENDACION_ANDREA: Recomendacion = {
  nombre: 'Andrea de Pablos',
  cargo: 'Responsable de Equipo',
  empresa: 'Itsmo',
  relacion: 'Supervisora directa',
  citas: [
    'Cuando leí el CV junto con el mensaje de aplicación a la oferta de Diego, pensé que era muy probable que el puesto fuese suyo. Ya no solo por los conocimientos en sí, sino por la manera de redactar el mensaje, cercano y claro, con una mezcla de genialidad.',
    'En la entrevista comentamos varias cosas técnicas con el departamento de desarrollo web con las que Diego estaba bastante familiarizado, como wordpress y elementor (requeridos para el puesto de trabajo).',
    'Una vez empezamos a trabajar juntos, me di cuenta de que todo es posible con Diego. A sus amplios conocimientos del mundo del desarrollo web se le suman su capacidad abrumadora de aprendizaje y resolución. Si hay una posibilidad de que algo pueda hacerse, Diego va a encontrarla.',
    'En lo personal, es una persona honesta, sencilla, clara, buen compañero, amable.. Una buena persona.',
    'Diego siempre suma.',
  ],
  hrefLinkedIn: 'https://www.linkedin.com/in/andreadepablos',
}

export const recomendaciones: Recomendacion[] = [
  RECOMENDACION_ANDREA,
  RECOMENDACION_JORGE,
]
