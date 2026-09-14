import HTML5Icon from '../components/shared/tech-icons/HTML5.astro'
import CSS3Icon from '../components/shared/tech-icons/CSS3.astro'
import TailwindIcon from '../components/shared/tech-icons/Tailwind.astro'
import JSIcon from '../components/shared/tech-icons/JS.astro'
import JQueryIcon from '../components/shared/tech-icons/JQuery.astro'
import GitIcon from '../components/shared/tech-icons/Git.astro'
import PHPIcon from '../components/shared/tech-icons/PHP.astro'
import WordpressIcon from '../components/shared/tech-icons/Wordpress.astro'
import NodeJSIcon from '../components/shared/tech-icons/NodeJS.astro'
import PostmanIcon from '../components/shared/tech-icons/Postman.astro'
import ExpressJSIcon from '../components/shared/tech-icons/ExpressJS.astro'
import SequelizeIcon from '../components/shared/tech-icons/Sequelize.astro'
import PrismaIcon from '../components/shared/tech-icons/Prisma.astro'
import TursoIcon from '../components/shared/tech-icons/Turso.astro'
import VercelIcon from '../components/shared/tech-icons/Vercel.astro'
import ReactIcon from '../components/shared/tech-icons/React.astro'
import MaterialUIIcon from '../components/shared/tech-icons/MaterialUI.astro'
import StripeIcon from '../components/shared/tech-icons/Stripe.astro'
import VueIcon from '../components/shared/tech-icons/Vue.astro'
import ChromeIcon from '../components/shared/tech-icons/Chrome.astro'
import PythonIcon from '../components/shared/tech-icons/Python.astro'
import FlaskIcon from '../components/shared/tech-icons/Flask.astro'
import MongoDBIcon from '../components/shared/tech-icons/MongoDB.astro'
import DockerIcon from '../components/shared/tech-icons/Docker.astro'

export const ETIQUETAS = {
  HTML5: { nombre: 'HTML5', titulo: '', clase: 'bg-orange-600/50 text-white', icono: HTML5Icon },
  CSS3: { nombre: 'CSS3', titulo: '', clase: 'bg-indigo-700/50 text-white', icono: CSS3Icon },
  TAILWIND: {
    nombre: 'Tailwind',
    titulo: '',
    clase: 'bg-teal-700/50 text-white',
    icono: TailwindIcon,
  },
  JS: { nombre: 'Javascript', titulo: '', clase: 'bg-yellow-400/50 text-white', icono: JSIcon },
  JQUERY: { nombre: 'JQuery', titulo: '', clase: 'bg-sky-600/50 text-white', icono: JQueryIcon },
  GIT: { nombre: 'Git', titulo: '', clase: 'bg-red-900/50 text-white', icono: GitIcon },
  PHP: { nombre: 'PHP', titulo: '', clase: 'bg-[#6c70a4] text-white', icono: PHPIcon },
  WORDPRESS: {
    nombre: 'Wordpress',
    titulo: '',
    clase: 'bg-indigo-800/50 text-white',
    icono: WordpressIcon,
  },
  NODEJS: { nombre: 'NodeJS', titulo: '', clase: 'bg-green-800/50 text-white', icono: NodeJSIcon },
  POSTMAN: {
    nombre: 'Postman',
    titulo: '',
    clase: 'bg-orange-600/50 text-white',
    icono: PostmanIcon,
  },
  EXPRESSJS: {
    nombre: 'ExpressJS',
    titulo: '',
    clase: 'bg-gray-100/50 text-white',
    icono: ExpressJSIcon,
  },
  SEQUELIZE: {
    nombre: 'Sequelize',
    titulo: '',
    clase: 'bg-indigo-800/50 text-white',
    icono: SequelizeIcon,
  },
  PRISMA: { nombre: 'Prisma', titulo: '', clase: 'bg-gray-100/50 text-white', icono: PrismaIcon },
  TURSO: { nombre: 'Turso', titulo: '', clase: 'bg-gray-100/50 text-white', icono: TursoIcon },
  VERCEL: { nombre: 'Vercel', titulo: '', clase: 'bg-gray-100/50 text-white', icono: VercelIcon },
  REACT: { nombre: 'React', titulo: '', clase: 'bg-indigo-800/50 text-white', icono: ReactIcon },
  MATERIALUI: {
    nombre: 'MaterialUI',
    titulo: '',
    clase: 'bg-indigo-800/50 text-white',
    icono: MaterialUIIcon,
  },
  CHROME: { nombre: 'Chrome', titulo: '', clase: 'bg-sky-600/50 text-white', icono: ChromeIcon },
  DOCKER: { nombre: 'Docker', titulo: '', clase: 'bg-sky-600/50 text-white', icono: DockerIcon },
  PYTHON: { nombre: 'Python', titulo: '', clase: 'bg-yellow-400/50 text-white', icono: PythonIcon },
  FLASK: { nombre: 'Flask', titulo: '', clase: 'bg-gray-100/50 text-white', icono: FlaskIcon },
  MONGODB: {
    nombre: 'MongoDB',
    titulo: '',
    clase: 'bg-emerald-600/50 text-white',
    icono: MongoDBIcon,
  },
  STRIPE: { nombre: '', titulo: 'Stripe', clase: 'bg-gray-100/90 text-white', icono: StripeIcon },
  VUE: { nombre: 'Vue', titulo: '', clase: 'bg-emerald-700/50 text-white', icono: VueIcon },
} as const

export type Etiqueta = (typeof ETIQUETAS)[keyof typeof ETIQUETAS]
