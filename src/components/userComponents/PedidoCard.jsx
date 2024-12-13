import React from 'react';
import MercadoPago from '../../components/home/MercadoPago.jsx';

const PedidoCard = ({
    pedido,
    abrirDetalleModal,
    abrirEstadoModal,
    cancelarPedido,
    backUrls,
    getEstadoColor,
    capitalizeFirstLetter,
}) => {
    return (
        <div className="w-full sm:w-80 lg:w-96 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden">
            {/* Encabezado del Pedido */}
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-700 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16 6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h12zm0 2H4v6h12V8z" />
                    </svg>
                    <h2 className="text-lg font-semibold text-gray-800">Pedido ID: {pedido.idPedido}</h2>
                </div>
                <span className={`text-sm font-medium ${getEstadoColor(pedido.estado)}`}>
                    {capitalizeFirstLetter(pedido.estado)}
                </span>
            </div>

            {/* Información Básica del Pedido */}
            <div className="p-4">
                <p className="text-gray-600">Total: <span className="font-semibold">S/{Number(pedido.total).toFixed(2)}</span></p>
            </div>

            {/* Dirección del Pedido */}
            <div className="p-4 border-t">
                <h3 className="text-sm font-medium text-gray-700">Dirección:</h3>
                {pedido.direccionEnvio ? (
                    <div className="text-sm text-gray-600 mt-1">
                        <p><strong>Departamento:</strong> {pedido.direccionEnvio.departamento}</p>
                        <p><strong>Distrito:</strong> {pedido.direccionEnvio.distrito}</p>
                        <p><strong>Provincia:</strong> {pedido.direccionEnvio.provincia}</p>
                        <p><strong>Dirección:</strong> {pedido.direccionEnvio.direccion}</p>
                    </div>
                ) : (
                    <p className="text-gray-500">No se ha proporcionado una dirección.</p>
                )}
            </div>

            {/* Botones de Acción */}
            <div className="p-4 flex flex-col gap-2 mt-auto">
                <button
                    className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-900 transition-colors"
                    onClick={() => abrirDetalleModal(pedido.detalles)}
                >
                    Ver Detalles
                </button>

                {pedido.estado.toLowerCase() !== 'pendiente' && (
                    <button
                        className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                        onClick={() => abrirEstadoModal(pedido.estado)}
                    >
                        Ver Estado
                    </button>
                )}

                <div className="flex flex-col gap-2">
                    {pedido.estado.toLowerCase() !== 'aprobando' &&
                        pedido.estado.toLowerCase() !== 'en preparacion' &&
                        pedido.estado.toLowerCase() !== 'enviado' &&
                        pedido.estado.toLowerCase() !== 'completado' && (
                            <MercadoPago pedido={pedido} backUrls={backUrls} />
                    )}

                    {pedido.estado.toLowerCase() === 'pendiente' && (
                        <button
                            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            onClick={() => cancelarPedido(pedido.idPedido)}
                        >
                            Cancelar Pedido
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PedidoCard;
