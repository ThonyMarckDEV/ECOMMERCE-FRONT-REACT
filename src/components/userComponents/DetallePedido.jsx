import React from 'react';

const DetalleProducto = ({ detalles, direccion, total, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg w-11/12 max-w-4xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">Detalles del Pedido</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
    
            {/* Table Container */}
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">Producto</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">Modelo</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">Talla</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Cantidad</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Precio</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {detalles.map((detalle) => (
                      <tr 
                        key={detalle.idDetallePedido}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{detalle.nombreProducto}</p>
                            <p className="text-xs text-gray-500">ID: {detalle.idProducto}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">{detalle.nombreModelo}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{detalle.nombreTalla}</td>
                        <td className="px-4 py-4 text-sm text-gray-900 text-center">{detalle.cantidad}</td>
                        <td className="px-4 py-4 text-sm text-gray-600 text-right">
                          S/{Number(detalle.precioUnitario).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 text-right">
                          S/{Number(detalle.subtotal).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
    
            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-gray-100">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-black text-sm font-medium text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      );
};

export default DetalleProducto;
