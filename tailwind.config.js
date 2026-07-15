/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c5a059',
          dark: '#a38245',
        },
        background: '#050505', // Deep premium jet black (not brown)
        card: '#1f1f1f', // Distinct premium dark gray for cards
        textPrimary: '#ffffff',
        textSecondary: '#a3a3a3',
        border: '#333333',
        success: '#10b981',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      animation: {
        'border-flow': 'border-flow 3s ease-in-out infinite',
      },
      keyframes: {
        'border-flow': {
          '0%, 100%': { borderColor: 'rgba(197, 160, 89, 0.2)' },
          '50%': { borderColor: 'rgba(197, 160, 89, 1)' },
        }
      }
    },
  },
  plugins: [],
}
