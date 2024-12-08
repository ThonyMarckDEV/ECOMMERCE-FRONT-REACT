import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../js/urlHelper.js';
import { verificarYRenovarToken } from '../../js/authToken.js';
import NavbarHome from '../../components/home/NavBarHome.jsx';
import MercadoPago from '../../components/home/MercadoPago.jsx';
import Estado from '../../components/home/Estado.jsx'; // Asegúrate de importar Estado.jsx

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('jwt'));
    const [detallesVisibles, setDetallesVisibles] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [estadoActual, setEstadoActual] = useState('');
    
    const abrirEstadoModal = (estado) => {
        setEstadoActual(estado);
        setModalVisible(true);
    };
    
    const cerrarEstadoModal = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        fetchPedidos();
        // Verificar el estado del pago al cargar la página
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

    const renderDetalles = (detalles) => {
        return detalles.map((detalle) => (
            <tr key={detalle.idDetallePedido}>
                <td className="py-2 px-4 border">{detalle.idDetallePedido}</td>
                <td className="py-2 px-4 border">{detalle.idProducto}</td>
                <td className="py-2 px-4 border">{detalle.nombreProducto}</td>
                <td className="py-2 px-4 border">{detalle.cantidad}</td>
                <td className="py-2 px-4 border">S/{Number(detalle.precioUnitario).toFixed(2)}</td>
                <td className="py-2 px-4 border">S/{Number(detalle.subtotal).toFixed(2)}</td>
            </tr>
        ));
    };

    const handleToggleDetalles = (idPedido) => {
        setDetallesVisibles((prevState) => ({
            ...prevState,
            [idPedido]: !prevState[idPedido], // Cambiar la visibilidad del detalle de este pedido
        }));
    };

    const renderPedidos = () => {
        return pedidos.map((pedido) => {
            // URLs de retorno para MercadoPago
            const currentUrlBase = window.location.origin; // Asegúrate de usar el URL correcto
            const backUrls = {
                success: `${currentUrlBase}/pedidos?status=approved&external_reference=${pedido.idPedido}`,
                failure: `${currentUrlBase}/pedidos?status=failure`,
                pending: `${currentUrlBase}/pedidos?status=pending`
            };

            const getEstadoColor = (estado) => {
              const estadoNormalized = estado.trim().toLowerCase(); // Normaliza el estado
              switch (estadoNormalized) {
                  case 'pendiente':
                      return 'text-orange-500';  // Naranja
                  case 'aprobando':
                      return 'text-gray-600';  // Gris oscuro
                  case 'en preparacion':
                      return 'text-blue-500';  // Azul
                  case 'enviado':
                      return 'text-blue-800';  // Azul oscuro
                  case 'completado':
                      return 'text-green-300';  // Verde claro
                  default:
                      return 'text-red-500';  // Rojo en caso de que haya un estado no reconocido
              }
          };

            return (
              <div key={pedido.idPedido} className="pedido-container p-4 sm:p-6 border rounded-xl mb-6 shadow-xl bg-white hover:shadow-2xl transition-all">
                  {/* Renderiza el modal de estado si está visible */}
                  {modalVisible && <Estado estadoActual={estadoActual} onClose={cerrarEstadoModal} />}
          
                  <div className="flex justify-between items-center mb-4">
                      <div className="font-semibold text-lg sm:text-xl text-gray-800">Pedido ID: {pedido.idPedido}</div>
                      <div className={`text-lg font-semibold ${getEstadoColor(pedido.estado)}`}>
                          {capitalizeFirstLetter(pedido.estado)}
                      </div>
                  </div>
                  <div className="mb-4">
                      <p className="text-gray-600 text-sm sm:text-lg">Total: <strong className="text-xl">S/{Number(pedido.total).toFixed(2)}</strong></p>
                  </div>
          
                  {/* Botón para ver detalles */}
                  <div className="mt-4">
                      <button 
                          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-600 transition-all w-full sm:w-auto"
                          onClick={() => handleToggleDetalles(pedido.idPedido)}
                      >
                          {detallesVisibles[pedido.idPedido] ? 'Ocultar Detalles' : 'Ver Detalles'}
                      </button>
                  </div>
          
                  {/* Botón para ver estado solo si el estado es 'pendiente' */}
                  <div className="mt-4">
                      {pedido.estado.toLowerCase() !== 'pendiente' && (
                          <button
                              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-800 transition-all w-full sm:w-auto"
                              onClick={() => abrirEstadoModal(pedido.estado)}
                          >
                              Ver Estado
                          </button>
                      )}
                  </div>
          
                  {/* Detalles del pedido */}
                  {detallesVisibles[pedido.idPedido] && (
                      <div className="mt-6 overflow-x-auto">
                          <table className="min-w-full table-auto">
                              <thead>
                                  <tr className="bg-gray-100">
                                      <th className="py-2 px-4 border text-left text-sm sm:text-base">ID Detalle</th>
                                      <th className="py-2 px-4 border text-left text-sm sm:text-base">ID Producto</th>
                                      <th className="py-2 px-4 border text-left text-sm sm:text-base">Producto</th>
                                      <th className="py-2 px-4 border text-left text-sm sm:text-base">Cantidad</th>
                                      <th className="py-2 px-4 border text-left text-sm sm:text-base">Precio Unitario</th>
                                      <th className="py-2 px-4 border text-left text-sm sm:text-base">Subtotal</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {renderDetalles(pedido.detalles)}
                              </tbody>
                          </table>
                      </div>
                  )}
          
                  {/* Dirección arriba de los botones */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-700 text-sm sm:text-lg">Dirección:</p>
                      {pedido.direccion ? (
                          <>
                              <p className="text-gray-600 text-sm sm:text-base"><strong>Región:</strong> {pedido.direccion.region}</p>
                              <p className="text-gray-600 text-sm sm:text-base"><strong>Provincia:</strong> {pedido.direccion.provincia}</p>
                              <p className="text-gray-600 text-sm sm:text-base"><strong>Dirección:</strong> {pedido.direccion.direccion}</p>
                          </>
                      ) : (
                          <p className="text-gray-500 text-sm sm:text-base">No se ha proporcionado una dirección.</p>
                      )}
                  </div>
          
                  {/* Botones: Pagar y Cancelar */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                      {pedido.estado.toLowerCase() !== 'aprobando' &&
                        pedido.estado.toLowerCase() !== 'en preparacion' &&
                        pedido.estado.toLowerCase() !== 'enviado' &&
                        pedido.estado.toLowerCase() !== 'completado' && (
                          <div className="w-full sm:w-auto">
                              <MercadoPago pedido={pedido} backUrls={backUrls} />
                          </div>
                      )}
          
                      {pedido.estado.toLowerCase() === 'pendiente' && (
                          <div className="w-full sm:w-auto">
                              <button
                                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm sm:text-lg w-full"
                                  onClick={() => cancelarPedido(pedido.idPedido)}
                              >
                                  Cancelar Pedido
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          );
        });
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <NavbarHome />
            {notification && (
                <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${notification.bgColor} rounded shadow-md`}>
                    {notification.message}
                </div>
            )}
            {loading ? (
                <div className="flex justify-center items-center py-10">Cargando...</div>
            ) : (
                <div className="max-w-4xl mx-auto py-10">
                    {renderPedidos()}
                </div>
            )}
        </div>
    );
};

export default Pedidos;
