/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#72F2EB',
          DEFAULT: '#00CCC0',
          dark: '#1B7F79',
        },
        offWhite: '#F0F2F5',
      },
    },
  },
  plugins: [],
};
