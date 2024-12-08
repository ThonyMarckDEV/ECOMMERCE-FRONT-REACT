// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Asegúrate de que Tailwind escanee tus archivos
  ],
  theme: {
    extend: {
      keyframes: {
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        progress: 'progress linear forwards',
      },
    },
  },
  plugins: [],
};
