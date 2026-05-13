import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8EC',
        'cream-dark': '#F5E6C8',
        'cream-darker': '#E8D5B7',
        gold: '#D4A853',
        'gold-light': '#E8C97A',
        'gold-dark': '#C49B3E',
        violet: '#7B6B8A',
        'violet-light': '#9B8BAA',
        'violet-dark': '#6B5B7A',
        'warm-dark': '#2A2432',
        'warm-darkest': '#1E1A24',
        'warm-dark-mid': '#3D3648',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        handwritten: ['Caveat', 'cursive'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'drift-up': 'driftUp 20s linear infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        driftUp: {
          '0%': { transform: 'translateY(100vh)' },
          '100%': { transform: 'translateY(-100vh)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.15)' },
          '30%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.1)' },
          '60%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
