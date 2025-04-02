/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-fast': 'pulse-fast 0.3s cubic-bezier(0, 0, 0.2, 1) forwards',
      },
      keyframes: {
        'pulse-fast': {
          '0%': {
            opacity: 0,
            transform: 'scale(0.8)',
          },
          '50%': {
            opacity: 0.5,
          },
          '100%': {
            opacity: 0,
            transform: 'scale(1.5)',
          },
        },
      },
    },
  },
  plugins: [],
}