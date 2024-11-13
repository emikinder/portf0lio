/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        customBlack: '#161616',
        customWhite: '#EBEBEB',
        customPink: '#F2B5A7',
        customGreen: '#C1D96A',
        customPurple: '#B599F2',
        customYellow: '#F2DD72',
      },
    },
  },
  plugins: [],
};
