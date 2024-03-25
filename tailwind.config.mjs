/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				orange: {
					500: '#f39c19',
					600: '#b57008',
				},
			}
		},
	},
	plugins: [],
}
