/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			keyframes: {
				'slide-in-down-on': {
					'0%': {
						opacity: '0',
						transform: 'translateY(-100%)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-down-off': {
					'0%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(-100%)'
					}
				}
			},
			animation: {
				'slide-in-down-on': 'slide-in-down-on 0.5s ease-out backwards',
				'slide-in-down-off': 'slide-in-down-off 0.5s ease-out both',
			}
		}
	},
	plugins: [],
}
