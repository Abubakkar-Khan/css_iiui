/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        surface: 'var(--surface)',
        fg: 'var(--fg)',
        bg: 'var(--bg)',
      },
    },
  },
  plugins: [],
}