/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#c0392b',
          'red-dark': '#962d22',
          green: '#27ae60',
          dark: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
};
