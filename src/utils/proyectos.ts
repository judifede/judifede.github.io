import type { ImageMetadata } from 'astro'
import { getCollection, type CollectionEntry } from 'astro:content'

import type {
  RecursoGaleriaDescriptor,
  RecursoImagen,
  RecursoProyecto,
} from '../components/proyectos/recursos'
import { ETIQUETAS, type Etiqueta } from '../data/etiquetas'
import { ORDEN_PROYECTOS, obtenerPosicionOrden, type CategoriaOrden } from '../data/ordenProyectos'

export type CategoriaProyecto = CategoriaOrden
export type ProyectoEntry = CollectionEntry<'proyectos'>

export interface ProyectoCompleto {
  id: string
  titulo: string
  descripciones: readonly string[]
  enlace?: string
  repositorio?: string
  recurso: RecursoProyecto
  etiquetas: readonly Etiqueta[]
  categoria: CategoriaProyecto
  status: 'publicado' | 'en-desarrollo'
  order: number
}

/**
 * Valida que un `ImageMetadata` cargado por `import.meta.glob` siga siendo
 * utilizable. Si Astro/Vite cacheó un asset que luego se borró en disco, el
 * objeto puede existir pero `src` apuntar a una URL rota; este guard evita
 * que llegue al componente `<Image>` y dispare `[ImageNotFound]`.
 */
function imagenValida(meta: ImageMetadata | undefined): meta is ImageMetadata {
  if (!meta) return false
  if (typeof meta.src !== 'string' || meta.src.length === 0) return false
  if (typeof meta.width !== 'number' || meta.width <= 0) return false
  if (typeof meta.height !== 'number' || meta.height <= 0) return false
  return true
}

const imagenesPorCarpeta = import.meta.glob<{ default: ImageMetadata }>(
  '../content/proyectos/*/*.{webp,png,jpg}',
  { eager: true }
)
const videosPorCarpeta = import.meta.glob<string>('../content/proyectos/*/*.mp4', {
  query: '?url',
  import: 'default',
  eager: true,
})

export function obtenerSlugProyecto(entry: ProyectoEntry) {
  return entry.id.split('/')[0]
}

export async function obtenerEntradasProyectos(): Promise<ProyectoEntry[]> {
  const entries = await getCollection('proyectos')

  const porCategoria: Record<CategoriaOrden, ProyectoEntry[]> = {
    corporativos: [],
    personales: [],
    'pruebas-tecnicas': [],
  }

  const indicePorSlug = new Map<string, number>()
  const categoriasOrden: readonly CategoriaOrden[] = [
    'corporativos',
    'personales',
    'pruebas-tecnicas',
  ]
  for (const categoria of categoriasOrden) {
    ORDEN_PROYECTOS[categoria].forEach((slug, idx) => {
      indicePorSlug.set(slug, idx)
    })
  }

  for (const entry of entries) {
    const slug = obtenerSlugProyecto(entry)
    const categoria = entry.data.category as CategoriaOrden
    if (!(categoria in porCategoria)) continue
    porCategoria[categoria].push(entry)
  }

  for (const categoria of categoriasOrden) {
    porCategoria[categoria].sort((a, b) => {
      const slugA = obtenerSlugProyecto(a)
      const slugB = obtenerSlugProyecto(b)
      const posA = indicePorSlug.get(slugA)
      const posB = indicePorSlug.get(slugB)
      if (posA === undefined && posB === undefined) return 0
      if (posA === undefined) return 1
      if (posB === undefined) return -1
      return posA - posB
    })
  }

  return [
    ...porCategoria.corporativos,
    ...porCategoria.personales,
    ...porCategoria['pruebas-tecnicas'],
  ]
}

export async function resolverProyectos(entries: ProyectoEntry[]): Promise<ProyectoCompleto[]> {
  return Promise.all(
    entries.map(async (entry) => {
      const id = obtenerSlugProyecto(entry)
      const carpeta = `../content/proyectos/${id}/`
      const data = entry.data

      let recurso: RecursoProyecto
      if (data.resource.type === 'galeria') {
        // Galería: resolvemos TODAS las imágenes en SSR (no solo el preview).
        // La galería unificada ya recibe los `src` finales.
        const items: RecursoGaleriaDescriptor[] = []
        let preview: RecursoImagen | undefined

        for (const item of data.resource.items) {
          if (item.type !== 'imagen') continue

          const imagenKey = `${carpeta}${item.nombre}`
          const loaderImagen = imagenesPorCarpeta[imagenKey]
          const img = loaderImagen?.default

          if (!imagenValida(img)) {
            console.warn(
              `[proyectos] "${id}" (galería): imagen inválida o no encontrada en ${imagenKey}. Se omitirá de la galería.`
            )
            continue
          }

          const descriptor: RecursoGaleriaDescriptor = {
            tipo: 'imagen',
            fuente: img,
            textoAlternativo: item.alt,
            ajuste: item.fit,
          }
          items.push(descriptor)

          if (!preview) {
            preview = {
              tipo: 'imagen',
              fuente: img,
              textoAlternativo: item.alt,
              ajuste: item.fit,
            }
          }
        }

        if (items.length === 0) {
          console.warn(
            `[proyectos] "${id}" (galería): ninguna imagen pudo resolverse. Revisa los nombres en frontmatter y que existan en ${carpeta}.`
          )
        }

        recurso = {
          tipo: 'galeria',
          preview,
          items,
        }
      } else if (data.resource.type === 'imagen') {
        const imagenKey = `${carpeta}${id}.webp`
        const loaderImagen = imagenesPorCarpeta[imagenKey]
        const img = loaderImagen?.default
        if (imagenValida(img)) {
          recurso = {
            tipo: 'imagen',
            fuente: img,
            textoAlternativo: data.resource.alt,
            ajuste: data.resource.fit,
          }
        } else {
          console.warn(`[proyectos] "${id}": no se encontró ${imagenKey}. Mostrando placeholder.`)
          recurso = {
            tipo: 'placeholder',
            textoAlternativo: data.resource.alt,
            motivo: 'imagen',
            ajuste: data.resource.fit,
          }
        }
      } else {
        const videoKey = `${carpeta}${id}.mp4`
        const cartelKey = `${carpeta}${id}.webp`
        const loaderVideo = videosPorCarpeta[videoKey]
        const loaderCartel = imagenesPorCarpeta[cartelKey]
        const video = loaderVideo as string | undefined
        const cartel = loaderCartel?.default
        const videoOk = typeof video === 'string' && video.length > 0
        const cartelOk = imagenValida(cartel)
        if (videoOk && cartelOk) {
          recurso = {
            tipo: 'video',
            fuente: video,
            cartel,
            etiquetaAccesible: data.resource.accessibleLabel,
            ajuste: data.resource.fit,
            ancho: data.resource.width,
            alto: data.resource.height,
          }
        } else {
          const faltan: string[] = []
          if (!videoOk) faltan.push(videoKey)
          if (!cartelOk) faltan.push(cartelKey)
          console.warn(
            `[proyectos] "${id}": faltan assets ${faltan.join(', ')}. Mostrando placeholder.`
          )
          recurso = {
            tipo: 'placeholder',
            textoAlternativo: data.resource.accessibleLabel,
            motivo: 'video',
            ajuste: data.resource.fit,
          }
        }
      }

      return {
        id,
        titulo: data.title,
        descripciones: data.descriptions,
        enlace: data.link,
        repositorio: data.repository,
        recurso,
        etiquetas: data.tags.map((tag) => ETIQUETAS[tag]),
        categoria: data.category,
        status: data.status,
        order: obtenerPosicionOrden(id),
      }
    })
  )
}
