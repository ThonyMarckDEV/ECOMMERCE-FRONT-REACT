import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../js/urlHelper.js';
import LoadingScreen from './LoadingScreen'; // Ajusta la ruta si es necesario

const MercadoPago = ({ pedido }) => {
    const [loading, setLoading] = useState(false);
    const [mercadoPago, setMercadoPago] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const scriptId = "mercadoPagoScript";
        const existingScript = document.getElementById(scriptId);

        if (existingScript) {
            // Si el script ya existe, inicializa MercadoPago
            if (window.MercadoPago) {
                setMercadoPago(new window.MercadoPago('TEST-75c3d6ce-fc69-4586-9056-e98a32568883', { locale: 'es-PE' }));
            }
            return;
        }

        // Crea e inserta el script si no existe
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://sdk.mercadopago.com/js/v2';
        script.onload = () => {
            if (window.MercadoPago) {
                setMercadoPago(new window.MercadoPago('TEST-75c3d6ce-fc69-4586-9056-e98a32568883', { locale: 'es-PE' }));
            } else {
                setError('Error al cargar el SDK de MercadoPago.');
            }
        };
        script.onerror = () => setError('Error al cargar el SDK de MercadoPago.');
        document.body.appendChild(script);

        return () => {
            // Verifica y elimina el script al desmontar
            const loadedScript = document.getElementById(scriptId);
            if (loadedScript) {
                document.body.removeChild(loadedScript);
            }
        };
    }, []);

    const handlePago = async () => {
        if (!mercadoPago) {
            setError("MercadoPago no está disponible.");
            return;
        }

        setLoading(true);
        setError(null);

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
                    idPedido: pedido.idPedido,
                    detalles: pedido.detalles,
                    total: pedido.total,
                    correo: correoUsuario,
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
            {error && <div className="py-2 text-center text-white bg-red-500 rounded-lg">{error}</div>}
            {!loading && (
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
