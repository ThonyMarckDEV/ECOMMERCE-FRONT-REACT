import React from 'react';

const Estado = ({ estadoActual, onClose }) => {
    const estados = ['aprobando', 'en preparacion', 'enviado', 'completado'];

    const gifs = {
        'aprobando': '/img/esperando.gif',
        'en preparacion': '/img/caja.gif',
        'enviado': '/img/camion.gif',
        'completado': '/img/completado.gif'
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg w-80 sm:w-96 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Estado del Pedido</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
    
            {/* Timeline */}
            <div className="p-6">
              <div className="space-y-6">
                {estados.map((estado, index) => {
                  const isActive = estados.indexOf(estadoActual.toLowerCase()) >= index;
                  
                  return (
                    <div key={index} className="relative">
                      <div className="flex items-center gap-4">
                        {/* Status Icon/Number */}
                        <div className="relative">
                          <div 
                            className={`
                              w-8 h-8 rounded-full flex items-center justify-center
                              ${isActive ? 'bg-black' : 'bg-gray-100'}
                              transition-colors duration-300
                            `}
                          >
                            <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                              {index + 1}
                            </span>
                          </div>
                          {index < estados.length - 1 && (
                            <div 
                              className={`
                                absolute top-8 left-1/2 w-0.5 h-14 -translate-x-1/2
                                ${isActive ? 'bg-black' : 'bg-gray-100'}
                                transition-colors duration-300
                              `}
                            />
                          )}
                        </div>
    
                        {/* Status Content */}
                        <div className="flex items-center gap-3">
                          <h3 className={`
                            text-sm font-medium
                            ${isActive ? 'text-gray-900' : 'text-gray-400'}
                          `}>
                            {capitalizeFirstLetter(estado)}
                          </h3>
                          
                          {isActive && gifs[estado] && (
                            <img 
                              src={gifs[estado]} 
                              alt={`Estado: ${estado}`} 
                              className="w-8 h-8"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
    
            {/* Footer */}
            <div className="p-6 border-t border-gray-100">
              <button
                onClick={onClose}
                className="w-full px-6 py-2.5 bg-black text-sm font-medium text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      );
};

export default Estado;
