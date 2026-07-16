/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#050505',
        'brand-neon': '#CCFF00',
        'brand-gray': '#1A1A1A',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'glow-neon': '0 0 15px rgba(204, 255, 0, 0.35)',
      }
    },
  },
  plugins: [],
}
