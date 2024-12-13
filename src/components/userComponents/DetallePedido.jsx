import React from 'react';

const DetalleProducto = ({ detalles, direccion, total, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-3xl overflow-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Detalles del Pedido</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-4">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 text-left">ID Detalle</th>
                                <th className="py-2 px-4 text-left">ID Producto</th>
                                <th className="py-2 px-4 text-left">Producto</th>
                                <th className="py-2 px-4 text-left">Modelo</th>
                                <th className="py-2 px-4 text-left">Talla</th>
                                <th className="py-2 px-4 text-left">Cantidad</th>
                                <th className="py-2 px-4 text-left">Precio Unitario</th>
                                <th className="py-2 px-4 text-left">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detalles.map((detalle) => (
                                <tr key={detalle.idDetallePedido} className="border-t">
                                    <td className="py-2 px-4">{detalle.idDetallePedido}</td>
                                    <td className="py-2 px-4">{detalle.idProducto}</td>
                                    <td className="py-2 px-4">{detalle.nombreProducto}</td>
                                    <td className="py-2 px-4">{detalle.nombreModelo}</td>
                                    <td className="py-2 px-4">{detalle.nombreTalla}</td>
                                    <td className="py-2 px-4">{detalle.cantidad}</td>
                                    <td className="py-2 px-4">S/{Number(detalle.precioUnitario).toFixed(2)}</td>
                                    <td className="py-2 px-4">S/{Number(detalle.subtotal).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-end p-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetalleProducto;
