import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../js/urlHelper.js';

const MercadoPago = ({ pedido }) => {
    const [loading, setLoading] = useState(false);
    const [mercadoPago, setMercadoPago] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Cargar el SDK de MercadoPago dinámicamente
        const script = document.createElement('script');
        script.src = 'https://sdk.mercadopago.com/js/v2';
        script.onload = () => {
            // Verificar que el SDK esté disponible después de cargarlo
            if (window.MercadoPago) {
                const mp = new window.MercadoPago('TEST-75c3d6ce-fc69-4586-9056-e98a32568883', {
                    locale: 'es-PE', // Cambia a tu región si es necesario
                });
                setMercadoPago(mp);
            } else {
                console.error("MercadoPago SDK no cargado correctamente");
                setError("Error al cargar el SDK de MercadoPago.");
            }
        };
        script.onerror = () => {
            console.error("Error al cargar el SDK de MercadoPago");
            setError("Error al cargar el SDK de MercadoPago.");
        };

        document.body.appendChild(script);

        // Cleanup al desmontar el componente (eliminar el script cargado)
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePago = async () => {
        if (!mercadoPago) {
            console.error("MercadoPago no está disponible");
            setError("MercadoPago no está disponible.");
            return;
        }

        // Mostrar la pantalla de carga
        setLoading(true);
        setError(null);  // Resetear el error

        // Obtener detalles del pedido
        const pedidoId = pedido.idPedido;
        const detallesPedido = pedido.detalles;
        const totalPedido = pedido.total;

        // Obtener el correo del usuario desde el token JWT
        const token = localStorage.getItem('jwt');
        const decodedToken = decodeJWT(token);
        const correoUsuario = decodedToken ? decodedToken.correo : null;

        if (!correoUsuario) {
            setLoading(false);
            setError('No se pudo obtener el correo del usuario.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/payment/preference`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    idPedido: pedidoId,
                    detalles: detallesPedido,
                    total: totalPedido,
                    correo: correoUsuario,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Usa el SDK de MercadoPago para abrir el modal
                mercadoPago.checkout({
                    preference: {
                        id: data.preference_id, // Usar el ID de la preferencia desde el back-end
                    },
                    autoOpen: true, // Abre el modal automáticamente
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
            {loading && (
                <div className="py-2 text-center text-white bg-blue-500 rounded-lg">Cargando...</div>
            )}

            {error && (
                <div className="py-2 text-center text-white bg-red-500 rounded-lg">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <button
                    onClick={handlePago}
                    className="w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                >
                    Pagar Pedido
                </button>
            )}
        </div>
    );
};

export default MercadoPago;
