import ordenJson from './ordenProyectos.json'

export type CategoriaOrden = 'corporativos' | 'personales' | 'pruebas-tecnicas'
export type OrdenPorCategoria = Readonly<Record<CategoriaOrden, readonly string[]>>

type OrdenJson = {
  schemaVersion: 1
  orden: {
    corporativos: readonly string[]
    personales: readonly string[]
    'pruebas-tecnicas': readonly string[]
  }
}

const ordenParseado = ordenJson as OrdenJson

const ordenObjeto: Record<CategoriaOrden, readonly string[]> = {
  corporativos: ordenParseado.orden.corporativos,
  personales: ordenParseado.orden.personales,
  'pruebas-tecnicas': ordenParseado.orden['pruebas-tecnicas'],
}

export const ORDEN_PROYECTOS: OrdenPorCategoria = ordenObjeto

const mapaPosiciones = new Map<string, number>()
const CATEGORIAS_ORDEN: readonly CategoriaOrden[] = [
  'corporativos',
  'personales',
  'pruebas-tecnicas',
]

for (const categoria of CATEGORIAS_ORDEN) {
  ordenObjeto[categoria].forEach((slug, idx) => {
    mapaPosiciones.set(slug, idx + 1)
  })
}

export function obtenerPosicionOrden(slug: string): number {
  const posicion = mapaPosiciones.get(slug)
  if (posicion === undefined) {
    throw new Error(`[ordenProyectos] El slug "${slug}" no aparece en ordenProyectos.json.`)
  }
  return posicion
}
