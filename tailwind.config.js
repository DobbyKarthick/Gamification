/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Xerago brand palette (green primary). Shades can be fine-tuned to exact brand specs.
        xerago: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // primary
          600: '#059669', // primary-darker
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Neutral for brand text if needed
        brandgray: {
          900: '#0b0b0b',
          800: '#1f2937',
          700: '#374151',
        },
      },
    },
  },
  plugins: [],
};
