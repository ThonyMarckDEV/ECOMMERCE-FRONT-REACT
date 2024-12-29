// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Asegúrate de que Tailwind escanee tus archivos
  ],
  theme: {
    extend: {
      animation: {
        progress: 'progress linear forwards',
        'fade-in': 'fadeIn 0.5s ease-in',
        'fade-in-down': 'fadeInDown 0.5s ease-in',
      },
      keyframes: {
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeInDown: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
