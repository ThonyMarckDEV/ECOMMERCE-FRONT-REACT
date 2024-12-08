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
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 sm:w-96">
                <h2 className="text-xl font-semibold text-center mb-4">Estado del Pedido</h2>
                <div id="timeline">
                    {estados.map((estado, index) => {
                        const isActive = estados.indexOf(estadoActual.toLowerCase()) >= index;

                        return (
                            <div key={index} className="flex flex-col items-center">
                                {isActive && (
                                    <img src={gifs[estado]} alt={`GIF de ${estado}`} className="w-12 h-12 mb-2" />
                                )}

                                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${isActive ? 'bg-black' : 'bg-gray-300'}`}>
                                    <span className="text-white font-bold">{index + 1}</span>
                                </div>

                                <p className={`mt-2 text-sm ${isActive ? 'text-black font-semibold' : 'text-gray-600'}`}>
                                    {capitalizeFirstLetter(estado)}
                                </p>

                                {index < estados.length - 1 && <div className="h-8 border-l-2 border-gray-300"></div>}
                            </div>
                        );
                    })}
                </div>
                <button
                    className="mt-4 w-full px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    onClick={onClose} // Usar la función onClose para cerrar el modal
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default Estado;
