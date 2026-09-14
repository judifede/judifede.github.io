export const MENSAJES_ANUNCIO_FILTRO: Record<string, string> = {
  todos: 'Mostrando todos los proyectos',
  corporativos: 'Mostrando proyectos corporativos',
  'pruebas-tecnicas': 'Mostrando pruebas técnicas',
  personales: 'Mostrando proyectos personales',
}

export const CATEGORIAS_FILTRO = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'corporativos', nombre: 'Corporativos' },
  { id: 'pruebas-tecnicas', nombre: 'Pruebas Técnicas' },
  { id: 'personales', nombre: 'Personales' },
] as const

export type CategoriaFiltro = (typeof CATEGORIAS_FILTRO)[number]['id']
