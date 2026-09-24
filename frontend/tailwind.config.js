/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quartzo: '#C8526B',
        'quartzo-hover': '#B0435B',
        pessego: '#FADCE1',
        petroleo: '#3B7280',
        'azul-pastel': '#EBF3F5',
        canvas: '#FDF7F8',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}