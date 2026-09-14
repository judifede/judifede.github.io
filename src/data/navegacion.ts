export const NAVEGACION = [
  { slug: 'about', titulo: 'Sobre mí' },
  { slug: '', titulo: 'Experiencia' },
  { slug: 'projects', titulo: 'Proyectos' },
] as const

export type PaginaNavegacion = (typeof NAVEGACION)[number]

export const rutaAnterior = (slug: string): string | null => {
  const idx = NAVEGACION.findIndex((n) => n.slug === slug)
  if (idx <= 0) return null
  const prev = NAVEGACION[idx - 1]
  return prev.slug === '' ? '/' : `/${prev.slug}`
}

export const rutaSiguiente = (slug: string): string | null => {
  const idx = NAVEGACION.findIndex((n) => n.slug === slug)
  if (idx === -1 || idx >= NAVEGACION.length - 1) return null
  return `/${NAVEGACION[idx + 1].slug}`
}
