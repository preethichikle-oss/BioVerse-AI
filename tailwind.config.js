/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#05070d',
        ink: '#0b1020',
        panel: 'rgba(12, 18, 34, 0.72)',
        cyanGlow: '#38f8ff',
        limeGlow: '#b8ff5d',
        roseGlow: '#ff5bd6',
        amberGlow: '#ffd166',
      },
      boxShadow: {
        neon: '0 0 26px rgba(56, 248, 255, 0.28)',
        bloom: '0 0 48px rgba(255, 91, 214, 0.2)',
        lime: '0 0 30px rgba(184, 255, 93, 0.22)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.45 },
          '50%': { opacity: 0.9 },
        },
      },
      animation: {
        scan: 'scan 4s linear infinite',
        pulseGlow: 'pulseGlow 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
