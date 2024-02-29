import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
	darkMode: 'class',
	integrations: [tailwind()],
	site: 'https://judifede.github.io/astroCV',
	base: '/astroCV'
})