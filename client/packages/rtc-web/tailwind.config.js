/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  daisyui: {
    themes: ['light', 'dark'],
  },
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};
