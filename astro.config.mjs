import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
	darkMode: 'class',
	integrations: [tailwind()],
	// public: './public',
	// ,site: 'https://judifede.github.io/astroCV',
	// base: '/astroCV'
})