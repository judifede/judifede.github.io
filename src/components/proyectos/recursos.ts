import type { ImageMetadata } from 'astro'

export type AjusteRecurso = 'recortar' | 'encajar'

export type RecursoImagen = {
  tipo: 'imagen'
  fuente?: ImageMetadata
  textoAlternativo: string
  ajuste: AjusteRecurso
}

export type RecursoVideo = {
  tipo: 'video'
  fuente?: string
  cartel?: ImageMetadata
  etiquetaAccesible: string
  ajuste: AjusteRecurso
  ancho: number
  alto: number
}

export type RecursoPlaceholder = {
  tipo: 'placeholder'
  textoAlternativo: string
  motivo: 'imagen' | 'video'
  ajuste: AjusteRecurso
}

export type RecursoGaleriaItem = RecursoImagen | RecursoVideo | RecursoPlaceholder

/**
 * Descriptor de un item de galería una vez resuelto en SSR.
 *
 * - `fuente` es la `ImageMetadata` ya resuelta por `import.meta.glob`.
 * - `textoAlternativo` y `ajuste` vienen del frontmatter.
 *
 * Mantiene `RecursoGaleriaItem` (incluye RecursoVideo / Placeholder) por
 * compatibilidad con `RecursoProyecto`, aunque la galería unificada sólo
 * soporta imágenes en la práctica.
 */
export type RecursoGaleriaDescriptor = {
  tipo: 'imagen'
  fuente?: ImageMetadata
  textoAlternativo: string
  ajuste: AjusteRecurso
}

export type RecursoProyecto =
  | RecursoGaleriaItem
  | {
      tipo: 'galeria'
      preview?: RecursoImagen
      items: RecursoGaleriaDescriptor[]
    }
