import React from 'react';
import mantimiento from '../../img/mantenimiento.png'; // Asegúrate de que la ruta sea correcta

const Mantenimiento = ({ mensaje }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4 relative">
      {/* Imagen de fondo */}
      <img 
        src={mantimiento} // Imagen representativa de mantenimiento
        alt="Mantenimiento"
        className="w-full h-full object-cover opacity-60 absolute top-0 left-0 right-0 bottom-0"
      />
      {/* Contenido del mensaje */}
      <div className="relative z-10 text-center p-8 sm:p-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          🚧 Estamos en Mantenimiento 🚧
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-6">
          {mensaje || 'Estamos trabajando para ofrecerte una mejor experiencia. Por favor, vuelve más tarde.'}
        </p>
        <p className="text-md sm:text-lg md:text-xl mt-4 opacity-75">
          Gracias por tu comprensión.
        </p>
      </div>
    </div>
  );
};

export default Mantenimiento;
