import React from 'react';

const CaracteristicasList = ({ caracteristicas }) => {
  if (!caracteristicas) return <span className="text-gray-500">Sin características</span>;
  
  // Dividir las características por comas y limpiar espacios en blanco
  const caracteristicasList = caracteristicas.split(',').map(item => item.trim());
  
  return (
    <div className="max-h-32 overflow-y-auto">
      <ul className="space-y-1">
        {caracteristicasList.map((caracteristica, index) => (
          <li key={index} className="text-sm text-gray-700 border-b border-gray-100 py-1">
            • {caracteristica}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CaracteristicasList;