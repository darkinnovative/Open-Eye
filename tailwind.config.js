/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nvr-bg': '#111',
        'nvr-card': 'rgba(255, 255, 255, 0.05)',
        'nvr-card-hover': 'rgba(255, 255, 255, 0.08)',
        'nvr-border': 'rgba(255, 255, 255, 0.1)',
        'nvr-border-hover': 'rgba(255, 255, 255, 0.3)',
        'nvr-primary': '#2196f3',
        'nvr-primary-hover': '#1976d2',
        'nvr-success': '#4caf50',
        'nvr-success-hover': '#45a049',
        'nvr-error': '#f44336',
        'nvr-error-hover': '#d32f2f',
        'nvr-warning': '#ff9800',
        'nvr-warning-hover': '#f57c00',
        'nvr-text': '#ffffff',
        'nvr-text-secondary': 'rgba(255, 255, 255, 0.7)',
        'nvr-text-muted': 'rgba(255, 255, 255, 0.5)',
        'nvr-header': '#1a1a1a',
        'nvr-sidebar': '#1f1f1f',
        'nvr-form-bg': '#2a2a2a',
      },
      fontFamily: {
        'nvr': ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      backdropBlur: {
        'nvr': '10px',
      },
      gridTemplateColumns: {
        'video-1': 'repeat(1, minmax(0, 1fr))',
        'video-4': 'repeat(2, minmax(0, 1fr))',
        'video-8': 'repeat(4, minmax(0, 1fr))',
        'video-9': 'repeat(3, minmax(0, 1fr))',
        'video-16': 'repeat(4, minmax(0, 1fr))',
        'video-32': 'repeat(8, minmax(0, 1fr))',
      },
      animation: {
        'pulse': 'pulse 0.6s ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
