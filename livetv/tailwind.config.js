/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0a',
          card: '#1a1a1a',
          elevated: '#222222',
        },
        accent: {
          red: '#e50914',
          orange: '#f97316',
          glow: 'rgba(229,9,20,0.4)',
        },
      },
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.4s ease-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 4px 1px rgba(229,9,20,0.6)', opacity: '1' },
          '50%': { boxShadow: '0 0 12px 4px rgba(229,9,20,0.9)', opacity: '0.7' },
        },
        slideIn: {
          from: { transform: 'translateX(-20px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'card-hover': '0 20px 60px rgba(0,0,0,0.8), 0 0 20px rgba(229,9,20,0.15)',
        'glow-red': '0 0 30px rgba(229,9,20,0.5)',
        'glass': '0 8px 32px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
