import type { AstroComponentFactory } from 'astro/runtime/server/index.js'

const ICONOS = import.meta.glob<{ default: AstroComponentFactory }>(
  '../components/shared/tech-icons/*.astro',
  {
    eager: true,
  }
)

export const ETIQUETAS = {
  HTML5: {
    nombre: 'HTML5',
    titulo: '',
    clase: 'bg-orange-600/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/HTML5.astro'].default,
  },
  CSS3: {
    nombre: 'CSS3',
    titulo: '',
    clase: 'bg-indigo-700/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/CSS3.astro'].default,
  },
  TAILWIND: {
    nombre: 'Tailwind',
    titulo: '',
    clase: 'bg-teal-700/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/Tailwind.astro'].default,
  },
  JS: {
    nombre: 'Javascript',
    titulo: '',
    clase: 'bg-yellow-400/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/JS.astro'].default,
  },
  JQUERY: {
    nombre: 'JQuery',
    titulo: '',
    clase: 'bg-sky-600/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/JQuery.astro'].default,
  },
  GIT: {
    nombre: 'Git',
    titulo: '',
    clase: 'bg-red-900/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/Git.astro'].default,
  },
  PHP: {
    nombre: 'PHP',
    titulo: '',
    clase: 'bg-[#6c70a4] text-white',
    icono: ICONOS['../components/shared/tech-icons/PHP.astro'].default,
  },
  WORDPRESS: {
    nombre: 'Wordpress',
    titulo: '',
    clase: 'bg-indigo-800/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/Wordpress.astro'].default,
  },
  NODEJS: {
    nombre: 'NodeJS',
    titulo: '',
    clase: 'bg-green-800/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/NodeJS.astro'].default,
  },
  POSTMAN: {
    nombre: 'Postman',
    titulo: '',
    clase: 'bg-orange-600/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/Postman.astro'].default,
  },
  EXPRESSJS: {
    nombre: 'ExpressJS',
    titulo: '',
    clase: 'bg-gray-100/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/ExpressJS.astro'].default,
  },
  SEQUELIZE: {
    nombre: 'Sequelize',
    titulo: '',
    clase: 'bg-indigo-800/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/Sequelize.astro'].default,
  },
  PRISMA: {
    nombre: 'Prisma',
    titulo: '',
    clase: 'bg-gray-100/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/Prisma.astro'].default,
  },
  TURSO: {
    nombre: 'Turso',
    titulo: '',
    clase: 'bg-gray-100/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/Turso.astro'].default,
  },
  VERCEL: {
    nombre: 'Vercel',
    titulo: '',
    clase: 'bg-gray-100/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/Vercel.astro'].default,
  },
  REACT: {
    nombre: 'React',
    titulo: '',
    clase: 'bg-indigo-800/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/React.astro'].default,
  },
  MATERIALUI: {
    nombre: 'MaterialUI',
    titulo: '',
    clase: 'bg-indigo-800/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/MaterialUI.astro'].default,
  },
  CHROME: {
    nombre: 'Chrome',
    titulo: '',
    clase: 'bg-sky-600/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/Chrome.astro'].default,
  },
  DOCKER: {
    nombre: 'Docker',
    titulo: '',
    clase: 'bg-sky-600/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/Docker.astro'].default,
  },
  PYTHON: {
    nombre: 'Python',
    titulo: '',
    clase: 'bg-yellow-400/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/Python.astro'].default,
  },
  FLASK: {
    nombre: 'Flask',
    titulo: '',
    clase: 'bg-gray-100/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/Flask.astro'].default,
  },
  MONGODB: {
    nombre: 'MongoDB',
    titulo: '',
    clase: 'bg-emerald-600/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/MongoDB.astro'].default,
  },
  STRIPE: {
    nombre: '',
    titulo: 'Stripe',
    clase: 'bg-gray-100/90 text-white',
    icono: ICONOS['../components/shared/tech-icons/Stripe.astro'].default,
  },
  VUE: {
    nombre: 'Vue',
    titulo: '',
    clase: 'bg-emerald-700/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/Vue.astro'].default,
  },
  TYPESCRIPT: {
    nombre: 'TypeScript',
    titulo: '',
    clase: 'bg-blue-600/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/TypeScript.astro'].default,
  },
  ASTRO: {
    nombre: 'Astro',
    titulo: '',
    clase: 'bg-orange-500/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/Astro.astro'].default,
  },
  SQLITE: {
    nombre: 'SQLite',
    titulo: '',
    clase: 'bg-sky-700/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/SQLite.astro'].default,
  },
  GOOGLECALENDAR: {
    nombre: 'Google Calendar',
    titulo: '',
    clase: 'bg-blue-500/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/GoogleCalendar.astro'].default,
  },
  TODOIST: {
    nombre: 'Todoist',
    titulo: '',
    clase: 'bg-red-500/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/Todoist.astro'].default,
  },
  PLAYWRIGHT: {
    nombre: 'Playwright',
    titulo: '',
    clase: 'bg-emerald-700/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/Playwright.astro'].default,
  },
  SUPABASE: {
    nombre: 'Supabase',
    titulo: '',
    clase: 'bg-emerald-600/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/Supabase.astro'].default,
  },
  POSTGRESQL: {
    nombre: 'PostgreSQL',
    titulo: '',
    clase: 'bg-blue-700/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/PostgreSQL.astro'].default,
  },
  RESEND: {
    nombre: 'Resend',
    titulo: '',
    clase: 'bg-black/60 text-white',
    icono: ICONOS['../components/shared/tech-icons/Resend.astro'].default,
  },
  OPENCODE: {
    nombre: 'OpenCode',
    titulo: '',
    clase: 'bg-gray-700/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/OpenCode.astro'].default,
  },
  GOOGLEKEEP: {
    nombre: 'Google Keep',
    titulo: '',
    clase: 'bg-yellow-500/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/GoogleKeep.astro'].default,
  },
  GOOGLETAKEOUT: {
    nombre: 'Google Takeout',
    titulo: '',
    clase: 'bg-gray-600/50 text-white',
    icono: ICONOS['../components/shared/tech-icons/GoogleTakeout.astro'].default,
  },
} as const

export type Etiqueta = {
  nombre: string
  titulo: string
  clase: string
  claseIcono?: string
  icono: AstroComponentFactory
}
