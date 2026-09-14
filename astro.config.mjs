import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import { existsSync } from 'node:fs'
import { loadEnv } from 'vite'

const mode = process.env.NODE_ENV ?? 'development'
const env = loadEnv(mode, process.cwd(), '')
const localCvManagerSetting = Object.hasOwn(process.env, 'LOCAL_CV_MANAGER')
  ? process.env.LOCAL_CV_MANAGER
  : env.LOCAL_CV_MANAGER
const localCvManagerEnabled = mode === 'development' && localCvManagerSetting === 'true'
const localCvPluginUrl = new URL('./local/cv/vite-plugin.js', import.meta.url)
const localCvPlugins = []

if (localCvManagerEnabled) {
  if (existsSync(localCvPluginUrl)) {
    const { localCvPlugin } = await import(localCvPluginUrl.href)
    localCvPlugins.push(localCvPlugin())
  } else {
    console.warn('[local-cv] Gestor activado, pero local/cv/vite-plugin.js no existe.')
  }
} else {
  localCvPlugins.push({
    name: 'block-local-cv',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const path = (request.url ?? '').split(/[?#]/, 1)[0]

        if (path !== '/local/cv' && !path.startsWith('/local/cv/')) {
          next()
          return
        }

        response.statusCode = 404
        response.setHeader('Content-Type', 'text/plain; charset=utf-8')
        response.end('Not Found')
      })
    },
  })
}

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: 'https://judifede.github.io',
  vite: {
    define: {
      'import.meta.env.LOCAL_CV_MANAGER_ENABLED': JSON.stringify(localCvManagerEnabled),
    },
    plugins: localCvPlugins,
  },
})
