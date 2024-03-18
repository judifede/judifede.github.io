import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
	darkMode: 'class',
	integrations: [tailwind()],
	pages: {
		index: '/src/pages/experience.astro',
	},
	site: 'https://judifede.github.io'
})