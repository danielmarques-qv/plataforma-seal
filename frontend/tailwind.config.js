/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Camuflagem Digital SEAL
        background: '#1D1D1B',
        surface: '#23262B',
        primary: '#785942',
        accent: '#4A3728',
        cream: '#F2EFE9',
        sand: '#C4A88E',
        // Aliases para facilitar uso
        tactical: {
          bg: '#1D1D1B',
          surface: '#23262B',
          primary: '#785942',
          accent: '#4A3728',
          text: '#F2EFE9',
          muted: '#C4A88E',
        }
      },
      fontFamily: {
        display: ['Archivo Black', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
      borderRadius: {
        'none': '0px',
      }
    },
  },
  plugins: [],
}
