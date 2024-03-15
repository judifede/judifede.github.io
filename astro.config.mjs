import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
	darkMode: 'class',
	integrations: [tailwind()],
	pages: {
		index: '/astroCV/src/pages/experience.astro',
	},
	site: 'https://judifede.github.io',
	base: '/astroCV'
})