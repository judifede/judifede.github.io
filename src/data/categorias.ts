import Maletin from '../components/shared/icons/Maletin.astro'
import Perfil from '../components/shared/icons/Perfil.astro'
import Prueba from '../components/shared/icons/Prueba.astro'

export const SECCIONES_PROYECTOS_META = [
  {
    id: 'seccion-corporativos',
    categoria: 'corporativos',
    titulo: 'Corporativos',
    icono: Maletin,
  },
  {
    id: 'seccion-pruebas-tecnicas',
    categoria: 'pruebas-tecnicas',
    titulo: 'Pruebas Técnicas',
    icono: Prueba,
    claseIcono: 'fill-yellow-300',
  },
  {
    id: 'seccion-personales',
    categoria: 'personales',
    titulo: 'Personales',
    icono: Perfil,
  },
] as const
