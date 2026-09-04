/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rev-bg': '#0f0f11', 
        'rev-accent': '#ff3366', 
        'rev-panel': '#1a1a1d', 
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
