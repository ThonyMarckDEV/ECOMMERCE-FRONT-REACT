import React, { useState, useEffect } from 'react';

const Notification = ({ description, bgColor }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Configurar el temporizador para desaparecer después de 3 segundos
    const timer = setTimeout(() => {
      setIsVisible(false); // Desactivar la visibilidad de la notificación
    }, 3000); // 3000 ms = 3 segundos

    // Limpiar el temporizador cuando el componente se desmonte o se actualice
    return () => clearTimeout(timer);
  }, []); // Solo se ejecuta una vez al montar el componente

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 p-4 z-50 ${bgColor} text-white text-center font-bold shadow-lg`} 
      style={{
        borderRadius: '8px',
        marginTop: '10px',
      }}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm sm:text-base">{description}</span>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 bg-transparent text-white font-bold text-lg sm:text-xl hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;