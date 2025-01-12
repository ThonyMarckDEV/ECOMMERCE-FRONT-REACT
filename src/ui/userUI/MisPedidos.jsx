import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../js/urlHelper.js';
import { verificarYRenovarToken } from '../../js/authToken.js';
import NavbarHome from '../../components/home/NavBarHome.jsx';
import DetalleProducto from '../../components/userComponents/DetallePedido.jsx';
import Estado from '../../components/userComponents/EstadoPedido.jsx';
import PedidoCard from '../../components/userComponents/PedidoCard.jsx';
import nopedidos from '../../img/nopedidos.png'; // Asegúrate de que la ruta sea correcta
import LoadingScreen from '../../components/home/LoadingScreen'; // Asegúrate de importar el componente
import SweetAlert from '../../components/SweetAlert';
import jwtUtils from '../../utilities/jwtUtils.jsx';

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(jwtUtils.getTokenFromCookie());
    const [isLoading, setIsLoading] = useState(false);

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
            SweetAlert.showMessageAlert('Error', 'idUsuario no disponible.', 'error'); 
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
                SweetAlert.showMessageAlert('Error', data.message, 'error'); 
            }
        } catch (error) {
            SweetAlert.showMessageAlert('Error', 'Error al obtener los pedidos. Intenta nuevamente.', 'error'); 
        } finally {
            setLoading(false);
        }
    };

    const cancelarPedido = async (idPedido) => {
        const confirmacion = window.confirm('¿Estás seguro de que deseas cancelar este pedido?');
        if (!confirmacion) return;

        setLoading(true);
        await verificarYRenovarToken();
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
                SweetAlert.showMessageAlert('Exito!', 'Pedido cancelado exitosamente.', 'success'); 
                fetchPedidos(); // Refrescar los pedidos
            } else {
                SweetAlert.showMessageAlert('Error', 'Error al cancelar el pedido.', 'error'); 
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentNotification = (status, externalReference) => {
        if (status === 'approved') {
            SweetAlert.showMessageAlert('Exito!', `Pago aprobado para el pedido: ${externalReference}`, 'success'); 
        } else if (status === 'failure') {
            SweetAlert.showMessageAlert('Error', `Pago fallido para el pedido ${externalReference}`, 'error'); 
        } else if (status === 'pending') {
            SweetAlert.showMessageAlert('Error',`Pago pendiente para el pedido ${externalReference}`, 'info'); 
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Navbar */}
            <NavbarHome />

            {/* Modales */}
            {estadoModalVisible && (
                <Estado estadoActual={estadoActual} onClose={cerrarEstadoModal} />
            )}

            {detalleModalVisible && (
                <DetalleProducto detalles={detallesPedido} onClose={cerrarDetalleModal} />
            )}

            {/* Pantalla de Carga */}
            {isLoading && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <LoadingScreen />
                </div>
            )}

            {/* Contenido Principal */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <LoadingScreen />
                </div>
            ) : pedidos.length === 0 ? (
                <div className="flex flex-col justify-center items-center pt-20 px-4">
                    <div className="text-center">
                        <img
                            src={nopedidos}
                            alt="No tienes pedidos"
                            className="mx-auto mb-8 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 transform hover:scale-105 transition-transform duration-300"
                        />
                        <div className="text-3xl sm:text-4xl text-gray-800 font-bold mb-4">
                            No tienes pedidos.
                        </div>
                        <p className="text-gray-600 text-lg">
                            ¡Explora nuestros productos y realiza tu primera compra!
                        </p>
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    {renderPedidos()}
                </div>
            )}
        </div>
    );
};

export default Pedidos;
