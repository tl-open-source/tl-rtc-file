/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  daisyui: {
    themes: ['light', 'dark'],
  },
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};
