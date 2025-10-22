/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        magenta: {
          500: '#e91e63',
          600: '#d81b60',
        },
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
}
