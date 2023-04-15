/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "back-light": {
          0: "#FFFFFF",
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#EEEEEE",
          300: "#E0E0E0",
          400: "#BDBDBD",
        },
        "primary": {
          50: "#e3f3ff",
          100: "#bbe0ff",
          200: "#8eceff",
          300: "#5bbaff",
          400: "#2eaaff",
          500: "#009bff",
          600: "#008dff",
          700: "#027aee",
          800: "#0b68dc",
          900: "#1248bd",
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      }
    },
  },
  plugins: [],
}

