/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5b8fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        dark: {
          900: '#0a0a0f',
          800: '#0f0f1a',
          700: '#141428',
          600: '#1a1a35',
          500: '#1e1e3a',
          400: '#252545',
          300: '#2d2d5a',
          200: '#3a3a6e',
        },
        accent: {
          cyan:    '#06b6d4',
          purple:  '#a855f7',
          pink:    '#ec4899',
          orange:  '#f97316',
          green:   '#22c55e',
          yellow:  '#eab308',
          red:     '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'slide-in':   'slideIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float':      'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                       to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn:   { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 20px rgba(99,102,241,0.4)' }, '50%': { boxShadow: '0 0 40px rgba(99,102,241,0.8)' } },
        float:     { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      boxShadow: {
        'glow-sm':   '0 0 15px rgba(99,102,241,0.3)',
        'glow-md':   '0 0 30px rgba(99,102,241,0.4)',
        'glow-lg':   '0 0 50px rgba(99,102,241,0.5)',
        'glow-cyan': '0 0 20px rgba(6,182,212,0.4)',
        'card':      '0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
