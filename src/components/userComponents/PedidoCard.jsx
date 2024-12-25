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
        <div className="w-full sm:w-80 lg:w-96 bg-white border border-gray-100 rounded-xl p-6 space-y-4 hover:border-gray-200 transition-all duration-200">
          {/* Order Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Pedido</span>
              <span className="text-sm font-medium">{pedido.idPedido}</span>
            </div>
            <span className={`text-sm font-medium ${getEstadoColor(pedido.estado)}`}>
              {capitalizeFirstLetter(pedido.estado)}
            </span>
          </div>
    
          {/* Order Total */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total</span>
            <span className="text-lg font-medium">S/{Number(pedido.total).toFixed(2)}</span>
          </div>
    
          {/* Shipping Address */}
          {pedido.direccionEnvio && (
            <div className="space-y-2">
              <h3 className="text-sm text-gray-500">Dirección de envío</h3>
              <div className="text-sm space-y-1">
                <p className="text-gray-600">{pedido.direccionEnvio.direccion}</p>
                <p className="text-gray-500">
                  {pedido.direccionEnvio.distrito}, {pedido.direccionEnvio.provincia}
                </p>
                <p className="text-gray-500">{pedido.direccionEnvio.departamento}</p>
              </div>
            </div>
          )}
    
          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <button 
              onClick={() => abrirDetalleModal(pedido.detalles)}
              className="w-full px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
            >
              Ver Detalles
            </button>
            
            {pedido.estado.toLowerCase() !== 'pendiente' && (
              <button 
                onClick={() => abrirEstadoModal(pedido.estado)}
                className="w-full px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Ver Estado
              </button>
            )}
    
            {pedido.estado.toLowerCase() === 'pendiente' && (
              <>
                <MercadoPago pedido={pedido} backUrls={backUrls} />
                <button 
                  onClick={() => cancelarPedido(pedido.idPedido)}
                  className="w-full px-4 py-2.5 bg-white text-red-600 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                >
                  Cancelar Pedido
                </button>
              </>
            )}
          </div>
        </div>
      );
};

export default PedidoCard;
