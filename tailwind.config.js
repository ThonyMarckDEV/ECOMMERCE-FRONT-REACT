// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Asegúrate de que Tailwind escanee tus archivos
  ],
  theme: {
    extend: {
      animation: {
        progress: 'progress linear forwards',
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-in-down': 'fadeInDown 0.8s ease-out',
        'scale-up': 'scaleUp 0.5s ease-out',
        'rotate-in': 'rotateIn 1s ease-out',
        'bounce-in': 'bounceIn 1s ease-out',
        'flip-in': 'flipIn 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeInDown: {
          '0%': { opacity: 0, transform: 'translateY(-50px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.5)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        rotateIn: {
          '0%': { transform: 'rotate(-200deg)', opacity: 0 },
          '100%': { transform: 'rotate(0)', opacity: 1 },
        },
        bounceIn: {
          '0%': { opacity: 0, transform: 'translateY(-30px)' },
          '50%': { transform: 'translateY(15px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        flipIn: {
          '0%': { transform: 'rotateY(-180deg)', opacity: 0 },
          '100%': { transform: 'rotateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
