/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'var(--primary-color)',
          50: '#f9f9f9',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#d1d1d1',
          400: '#b1b1b1',
          500: 'var(--primary-color)',
          600: 'var(--primary-color)',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        accent: {
          DEFAULT: 'var(--accent-color)',
        },
        background: {
          DEFAULT: 'var(--bg-color)',
        },
        text: {
          DEFAULT: 'var(--text-color)',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
