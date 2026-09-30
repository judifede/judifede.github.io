/**
 * Utilidades compartidas para la navegación del sitio (Header y Footer).
 *
 * Mantiene una única fuente de verdad para los items de navegación y la
 * lógica que decide cuál está "activo" según la ruta actual.
 */

export type NavItem = {
  title: string
  label: string
  url: string
}

export const navItems: NavItem[] = [
  { title: 'Experiencia', label: 'Enlace a experiencia', url: '/' },
  { title: 'Proyectos', label: 'Enlace a proyectos', url: '/projects' },
  { title: 'Sobre mí', label: 'Enlace a sobre mí', url: '/about' },
]

/**
 * Quita barras finales para que `/projects` y `/projects/` se consideren
 * la misma ruta. La raíz `/` se preserva tal cual.
 */
export const normalizePath = (path: string): string =>
  path.length > 1 ? path.replace(/\/+$/, '') : path

/**
 * Determina si un href debe mostrarse como activo en la navegación.
 *
 * Regla:
 * - `/` es exacto: solo activo cuando la ruta actual es `/`.
 * - Cualquier otro href coincide por prefijo: activo cuando la ruta
 *   actual es igual al href o empieza por `href + '/'`.
 */
export const esActiva = (href: string, currentPath: string): boolean => {
  const h = normalizePath(href)
  const c = normalizePath(currentPath)
  if (h === '/') return c === '/'
  return c === h || c.startsWith(h + '/')
}
