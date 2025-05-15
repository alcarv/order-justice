/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'ui-serif', 'serif'],
      },
      colors: {
        primary: {
          50: '#f0f6ff',
          100: '#e0ecff',
          200: '#c0d8ff',
          300: '#a1c2ff',
          400: '#819dff',
          500: '#6271fa',
          600: '#4e4eea',
          700: '#3e3bcf', 
          800: '#2f2e9e',
          900: '#1E293B', // Main navy color
          950: '#0e1532',
        },
        accent: {
          DEFAULT: '#D4AF37', // Gold accent
          light: '#E9D68A',
          dark: '#B08A00',
        },
      },
      boxShadow: {
        card: '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
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