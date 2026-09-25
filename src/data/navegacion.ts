export const NAVEGACION = [
  { slug: 'about', titulo: 'Sobre mí' },
  { slug: '', titulo: 'Experiencia' },
  { slug: 'projects', titulo: 'Proyectos' },
] as const

export type PaginaNavegacion = (typeof NAVEGACION)[number]
