// src/components/MercadoPago.jsx
import React, { useEffect, useState } from 'react';
import  API_BASE_URL  from '../../js/urlHelper.js';
import LoadingScreen from './LoadingScreen';
import SweetAlert from '../../components/SweetAlert'; // Importar SweetAlert
import jwtUtils from '../../utilities/jwtUtils.jsx';

const MercadoPago = ({ pedido }) => {
    const [loading, setLoading] = useState(false);
    const [mercadoPago, setMercadoPago] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const scriptId = "mercadoPagoScript";
        const existingScript = document.getElementById(scriptId);

        if (existingScript) {
            if (window.MercadoPago) {
                setMercadoPago(new window.MercadoPago('APP_USR-40a548aa-c96d-4b17-94e5-577e3a400a52', { locale: 'es-PE' })); //(SANDBOX)
                // setMercadoPago(new window.MercadoPago('APP_USR-191bf4cc-dd05-419c-87b5-d6a7773f181e', { locale: 'es-PE' })); //(PRODUCCION)
            }
            return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://sdk.mercadopago.com/js/v2';
        script.onload = () => {
            if (window.MercadoPago) {
                setMercadoPago(new window.MercadoPago('APP_USR-40a548aa-c96d-4b17-94e5-577e3a400a52', { locale: 'es-PE' }));  //(SANDBOX)
                // setMercadoPago(new window.MercadoPago('APP_USR-191bf4cc-dd05-419c-87b5-d6a7773f181e', { locale: 'es-PE' }));//(PRODUCCION)
            } else {
                setError('Error al cargar el SDK de MercadoPago.');
            }
        };
        script.onerror = () => setError('Error al cargar el SDK de MercadoPago.');
        document.body.appendChild(script);

        return () => {
            const loadedScript = document.getElementById(scriptId);
            if (loadedScript) {
                document.body.removeChild(loadedScript);
            }
        };
    }, []);

    const actualizarComprobante = async () => {
        const token = jwtUtils.getTokenFromCookie();
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/actualizar-comprobante`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    idPedido: pedido.idPedido,
                    tipo_comprobante: pedido.tipoComprobante,
                    ruc: pedido.tipoComprobante === 'factura' ? pedido.rucData.ruc : null,
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Error al actualizar el comprobante');
            }

            return true;
        } catch (error) {
            console.error('Error al actualizar comprobante:', error);
            throw error;
        }
    };

    const handlePago = async () => {
        if (!mercadoPago) {
            setError("MercadoPago no está disponible.");
            return;
        }

        setLoading(true);
        setError(null);

        const token = jwtUtils.getTokenFromCookie();
        const decodedToken = decodeJWT(token);
        const correoUsuario = decodedToken ? decodedToken.correo : null;

        if (!correoUsuario) {
            setLoading(false);
            setError('No se pudo obtener el correo del usuario.');
            return;
        }

        try {
            // Primero actualizar el comprobante
            await actualizarComprobante();

            // Luego proceder con la creación de la preferencia de pago
            const response = await fetch(`${API_BASE_URL}/api/payment/preference`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    idPedido: pedido.idPedido,
                    detalles: pedido.detalles,
                    total: pedido.total,
                    correo: correoUsuario,
                    tipo_comprobante: pedido.tipoComprobante,
                    ruc_data: pedido.tipoComprobante === 'factura' ? pedido.rucData : null
                }),
            });

            const data = await response.json();

            if (data.success) {
                mercadoPago.checkout({
                    preference: { id: data.preference_id },
                    autoOpen: true,
                });
            } else {
                setError(data.message || 'Error al crear la preferencia de pago.');
            }
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            setError('Error al procesar el pago. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const decodeJWT = (token) => {
        try {
            const payloadBase64 = token.split('.')[1];
            const payload = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
            return JSON.parse(payload);
        } catch (error) {
            console.error('Error al decodificar el JWT:', error);
            return null;
        }
    };

    return (
        <div>
            {loading && <LoadingScreen />}
            {error && (
                <div className="py-2 text-center text-white bg-red-500 rounded-lg mb-2">
                    {error}
                </div>
            )}
            {!loading && (
                <button
                    onClick={handlePago}
                    className="w-full px-4 py-2.5 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors"
                    disabled={loading}
                >
                    {loading ? 'Procesando...' : 'Pagar Pedido'}
                </button>
            )}
        </div>
    );
};

export default MercadoPago;