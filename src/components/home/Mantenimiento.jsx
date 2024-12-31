import React from 'react';

const Mantenimiento = ({ mensaje }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4">
      {/* Contenido del mensaje */}
      <div className="text-center max-w-2xl p-8 sm:p-12 bg-gray-800 bg-opacity-50 rounded-lg backdrop-blur-sm border border-gray-700 shadow-2xl">
        {/* Icono de mantenimiento */}
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-yellow-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        </div>

        {/* Título */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          🚧 Estamos en Mantenimiento 🚧
        </h1>

        {/* Mensaje personalizado */}
        <p className="text-lg sm:text-xl md:text-2xl mb-6 text-gray-300">
          {mensaje || 'Estamos trabajando para ofrecerte una mejor experiencia. Por favor, vuelve más tarde.'}
        </p>

        {/* Mensaje de agradecimiento */}
        <p className="text-md sm:text-lg md:text-xl mt-4 text-gray-400">
          Gracias por tu comprensión.
        </p>
      </div>
    </div>
  );
};

export default Mantenimiento;