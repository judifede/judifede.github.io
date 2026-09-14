import type { ImageMetadata } from 'astro'

export type AjusteRecurso = 'recortar' | 'encajar'

export type RecursoProyecto =
  | {
      tipo: 'imagen'
      fuente: ImageMetadata
      textoAlternativo: string
      ajuste: AjusteRecurso
    }
  | {
      tipo: 'video'
      fuente: string
      cartel: ImageMetadata
      etiquetaAccesible: string
      ajuste: AjusteRecurso
      ancho: number
      alto: number
    }
