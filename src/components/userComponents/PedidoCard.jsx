import React, { useState, useEffect } from 'react';
import MercadoPago from '../../components/home/MercadoPago.jsx';
import API_TOKEN from '../../js/tokenHelper.js';

const PedidoCard = ({
    pedido,
    abrirDetalleModal,
    abrirEstadoModal,
    cancelarPedido,
    backUrls,
    getEstadoColor,
    capitalizeFirstLetter,
}) => {
    const [tipoComprobante, setTipoComprobante] = useState('');
    const [ruc, setRuc] = useState('');
    const [rucValid, setRucValid] = useState(false);
    const [rucError, setRucError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rucData, setRucData] = useState(null);

    // Validate RUC with the provided API
    const validateRuc = async (rucNumber) => {
        if (rucNumber.length !== 11) {
            setRucError('El RUC debe tener 11 dígitos');
            setRucValid(false);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `https://dniruc.apisperu.com/api/v1/ruc/${rucNumber}?token=${API_TOKEN}`
            );
            const data = await response.json();
            
            if (data.ruc) {
                setRucValid(true);
                setRucError('');
                setRucData(data);
            } else {
                setRucError('RUC no encontrado o inválido');
                setRucValid(false);
                setRucData(null);
            }
        } catch (error) {
            setRucError('Error al validar el RUC. Intente nuevamente.');
            setRucValid(false);
            setRucData(null);
        } finally {
            setLoading(false);
        }
    };

    // Handle RUC input change
    const handleRucChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 11);
        setRuc(value);
        if (value.length === 11) {
            validateRuc(value);
        } else {
            setRucValid(false);
            setRucData(null);
        }
    };

    // Check if payment should be enabled
    const isPaymentEnabled = () => {
        if (tipoComprobante === 'boleta') return true;
        if (tipoComprobante === 'factura' && rucValid) return true;
        return false;
    };

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
                <span className="text-gray-600">Total: (IGV. 18%)</span>
                <span className="text-lg font-medium">S/{Number(pedido.total).toFixed(2)}</span>
            </div>

            {/* Shipping Address */}
            {pedido.direccionEnvio && (
                <div className="space-y-2">
                    <h3 className="text-sm text-black font-medium">Dirección de envío</h3>
                    <div className="text-sm space-y-1">
                        <p className="text-gray-600">{pedido.direccionEnvio.direccion}</p>
                        <p className="text-gray-500">
                            {pedido.direccionEnvio.distrito}, {pedido.direccionEnvio.provincia}
                        </p>
                        <p className="text-gray-500">{pedido.direccionEnvio.departamento}</p>
                    </div>
                </div>
            )}

            {/* Invoice Type Selection */}
            {pedido.estado.toLowerCase() === 'pendiente' && (
                <div className="space-y-3">
                    <select
                        value={tipoComprobante}
                        onChange={(e) => setTipoComprobante(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:border-gray-300 focus:ring-0"
                    >
                        <option value="">Seleccione tipo de comprobante</option>
                        <option value="boleta">Boleta</option>
                        <option value="factura">Factura</option>
                    </select>

                    {tipoComprobante === 'factura' && (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={ruc}
                                onChange={handleRucChange}
                                placeholder="Ingrese RUC"
                                className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm focus:ring-0 ${
                                    rucError ? 'border-red-300' : 'border-gray-200 focus:border-gray-300'
                                }`}
                            />
                            {loading && (
                                <p className="text-sm text-gray-500">Validando RUC...</p>
                            )}
                            {rucError && (
                                <p className="text-sm text-red-500">{rucError}</p>
                            )}
                            {rucValid && rucData && (
                                <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                                    <p className="text-sm font-medium text-gray-700">{rucData.razonSocial}</p>
                                    <p className="text-sm text-gray-600">{rucData.direccion}</p>
                                    <p className="text-sm text-gray-500">Estado: {rucData.estado}</p>
                                </div>
                            )}
                        </div>
                    )}
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
                        {isPaymentEnabled() ? (
                            <MercadoPago pedido={{...pedido, tipoComprobante, rucData}} backUrls={backUrls} />
                        ) : (
                            <button
                                disabled
                                className="w-full px-4 py-2.5 bg-gray-100 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed"
                            >
                                {!tipoComprobante ? 'Seleccione tipo de comprobante' : 'Complete los datos de facturación'}
                            </button>
                        )}
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