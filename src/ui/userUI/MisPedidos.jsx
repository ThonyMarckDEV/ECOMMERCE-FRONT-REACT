import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../js/urlHelper.js';
import { verificarYRenovarToken } from '../../js/authToken.js';
import NavbarHome from '../../components/home/NavBarHome.jsx';
import DetalleProducto from '../../components/userComponents/DetallePedido.jsx';
import Estado from '../../components/userComponents/EstadoPedido.jsx';
import PedidoCard from '../../components/userComponents/PedidoCard.jsx';
import nopedidos from '../../img/nopedidos.png'; // Asegúrate de que la ruta sea correcta

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('jwt'));

    // Estados para manejar los modales
    const [estadoModalVisible, setEstadoModalVisible] = useState(false);
    const [detalleModalVisible, setDetalleModalVisible] = useState(false);
    const [estadoActual, setEstadoActual] = useState('');
    const [detallesPedido, setDetallesPedido] = useState([]);

    const abrirEstadoModal = (estado) => {
        setEstadoActual(estado);
        setEstadoModalVisible(true);
    };

    const cerrarEstadoModal = () => {
        setEstadoActual('');
        setEstadoModalVisible(false);
    };

    const abrirDetalleModal = (detalles) => {
        setDetallesPedido(detalles);
        setDetalleModalVisible(true);
    };

    const cerrarDetalleModal = () => {
        setDetallesPedido([]);
        setDetalleModalVisible(false);
    };

    useEffect(() => {
        fetchPedidos();
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('status');
        const externalReference = urlParams.get('external_reference');
        if (paymentStatus && externalReference) {
            handlePaymentNotification(paymentStatus, externalReference);
        }
    }, [token]);

    const showNotification = (message, bgColor) => {
        setNotification({ message, bgColor });
        setTimeout(() => setNotification(null), 5000);
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

    const fetchPedidos = async () => {
        await verificarYRenovarToken();
        const decoded = decodeJWT(token);
        const idUsuario = decoded ? decoded.idUsuario : null;

        if (!idUsuario) {
            showNotification('Error: idUsuario no disponible.', 'bg-red-500');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/pedidos/${idUsuario}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setPedidos(data.pedidos);
            } else {
                showNotification(data.message, 'bg-red-500');
            }
        } catch (error) {
            showNotification('Error al obtener los pedidos. Intenta nuevamente.', 'bg-red-500');
        } finally {
            setLoading(false);
        }
    };

    const cancelarPedido = async (idPedido) => {
        const confirmacion = window.confirm('¿Estás seguro de que deseas cancelar este pedido?');
        if (!confirmacion) return;

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/cancelarPedido`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ idPedido }),
            });

            if (response.ok) {
                alert('Pedido cancelado exitosamente');
                fetchPedidos(); // Refrescar los pedidos
            } else {
                alert('Error al cancelar el pedido');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentNotification = (status, externalReference) => {
        if (status === 'approved') {
            showNotification(`Pago aprobado para el pedido ${externalReference}`, 'bg-green-500');
        } else if (status === 'failure') {
            showNotification(`Pago fallido para el pedido ${externalReference}`, 'bg-red-500');
        } else if (status === 'pending') {
            showNotification(`Pago pendiente para el pedido ${externalReference}`, 'bg-yellow-500');
        }
    };

    const getEstadoColor = (estado) => {
        const estadoNormalized = estado.trim().toLowerCase();
        switch (estadoNormalized) {
            case 'pendiente':
                return 'text-orange-500';
            case 'aprobando':
                return 'text-gray-600';
            case 'en preparacion':
                return 'text-blue-500';
            case 'enviado':
                return 'text-blue-800';
            case 'completado':
                return 'text-green-300';
            default:
                return 'text-red-500';
        }
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const renderPedidos = () => {
        return (
            <div className="flex flex-wrap gap-6 justify-center">
                {pedidos.map((pedido) => {
                    const currentUrlBase = window.location.origin;
                    const backUrls = {
                        success: `${currentUrlBase}/pedidos?status=approved&external_reference=${pedido.idPedido}`,
                        failure: `${currentUrlBase}/pedidos?status=failure&external_reference=${pedido.idPedido}`,
                        pending: `${currentUrlBase}/pedidos?status=pending&external_reference=${pedido.idPedido}`
                    };

                    return (
                        <PedidoCard
                            key={pedido.idPedido}
                            pedido={pedido}
                            abrirDetalleModal={abrirDetalleModal}
                            abrirEstadoModal={abrirEstadoModal}
                            cancelarPedido={cancelarPedido}
                            backUrls={backUrls}
                            getEstadoColor={getEstadoColor}
                            capitalizeFirstLetter={capitalizeFirstLetter}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <NavbarHome />
            {/* Notificación */}
            {notification && (
                <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${notification.bgColor} rounded shadow-md`}>
                    {notification.message}
                </div>
            )}

            {/* Modales */}
            {estadoModalVisible && (
                <Estado estadoActual={estadoActual} onClose={cerrarEstadoModal} />
            )}

            {detalleModalVisible && (
                <DetalleProducto detalles={detallesPedido} onClose={cerrarDetalleModal} />
            )}

            {/* Contenido Principal */}
            {loading ? (
                <div className="flex justify-center items-center py-10">Cargando...</div>
            ) : pedidos.length === 0 ? (
                <div className="flex flex-col justify-center items-center pt-16">
                    <div className="text-center">
                        <img
                           src={nopedidos}
                            alt="No tienes pedidos"
                            className="mx-auto mb-8 w-80 h-80 sm:w-80 sm:h-80 md:w-80 md:h-80 lg:w-96 lg:h-96"
                        />
                        <div className="text-3xl sm:text-4xl text-gray-600 font-semibold">
                            No tienes pedidos.
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto py-10 px-4">
                    {renderPedidos()}
                </div>
            )}
        </div>
    );
};

export default Pedidos;
