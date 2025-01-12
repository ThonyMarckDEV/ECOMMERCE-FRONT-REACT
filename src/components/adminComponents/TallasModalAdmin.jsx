import React from 'react';
import { X } from 'lucide-react';

export const TallasModal = ({ isOpen, onClose, tallas, selectedTallas, onTallaSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Seleccionar Tallas</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-3">
          {tallas.map((talla) => (
            <label key={talla.idTalla} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedTallas.some(t => t.idTalla === talla.idTalla)}
                onChange={() => onTallaSelect(talla)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">{talla.nombreTalla}</span>
            </label>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};