import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBarHome from '../../components/home/NavBarHome';
import LoadingScreen from '../../components/home/LoadingScreen';
import Notification from '../../components/home/Notificacion';
import ProductosCarrito from '../../components/userComponents/ProductosCarrito';
import { verificarYRenovarToken } from '../../js/authToken';
import API_BASE_URL from '../../js/urlHelper';
import { getIdUsuario } from '../../utilities/jwtUtils'; 
import { useCart } from '../../context/CartContext'; // Asegúrate de importar correctamente
import carritoVacio from '../../img/carritovacio.png'; // Asegúrate de que la ruta sea correcta


function Carrito() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const { updateCartCount } = useCart(); // Usamos el contexto de carrito
  const navigate = useNavigate();

  const mostrarNotificacion = (descripcion, color) => {

    setNotification({ description: descripcion, bgColor: color });
    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
      setNotification(null); // Limpiar la notificación
    }, 3000);
  };

  const obtenerCarrito = async () => {
    try {
      await verificarYRenovarToken();
      setIsLoading(true);
  
      const token = localStorage.getItem('jwt');
      const idUsuario = getIdUsuario(token);
  
      if (!idUsuario) {
        throw new Error("No se pudo obtener el ID del usuario.");
      }
  
      // Cambiamos la solicitud para enviar el idUsuario en el cuerpo
      const response = await fetch(`${API_BASE_URL}/api/carrito`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ idUsuario }),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProductos(data.data); // Incluye el idDetalle como parte del estado de los productos
        } else {
          mostrarNotificacion('No se pudo cargar el carrito.', 'bg-red-500');
        }
      } else {
        mostrarNotificacion('Error al obtener los productos del carrito.', 'bg-red-500');
      }
    } catch (error) {
      mostrarNotificacion('Ocurrió un error al obtener los productos.', 'bg-red-500');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    obtenerCarrito();
  }, []);

  const calcularTotal = () => {
    // Asegurarse de que el valor de cada subtotal es un número
    const totalSinIGV = productos.reduce((total, producto) => {
      const subtotal = producto.subtotal || 0;  // En caso de que el subtotal sea undefined o null, se asigna 0
      return total + parseFloat(subtotal);  // Aseguramos que el subtotal sea un número
    }, 0);
  
    // Calcular el IGV (18%)
    const igv = totalSinIGV * 0.18;
  
    // Calcular el total incluyendo el IGV
    const totalConIGV = totalSinIGV + igv;
  
    return totalConIGV;
  };


  const verificarDireccionUsuario = async () => {
    setIsLoading(true);
    try {
      await verificarYRenovarToken();
      const token = localStorage.getItem('jwt');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const idUsuario = payload.idUsuario;
  
      // Obtener datos del perfil
      const perfilResponse = await fetch(`${API_BASE_URL}/api/perfilCliente`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!perfilResponse.ok) {
        const data = await perfilResponse.json();
        mostrarNotificacion(data.message || 'Error al obtener datos del perfil', 'bg-red-500');
        setIsLoading(false);
        return;
      }
  
      const perfilData = await perfilResponse.json();
      const dni = perfilData?.data?.dni;
  
      // Validar DNI
      if (!dni || dni.length < 8 || /^[0]+$/.test(dni)) {
        mostrarNotificacion('Por favor, actualiza tu DNI a uno válido antes de realizar un pedido.', 'bg-red-500');
        setIsLoading(false);
        return;
      }
  
      // Verificar dirección
      const direccionResponse = await fetch(`${API_BASE_URL}/api/listarDireccionPedido/${idUsuario}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!direccionResponse.ok) {
        const data = await direccionResponse.json();
        mostrarNotificacion(data.message || 'Error al verificar la dirección', 'bg-red-500');
        setIsLoading(false);
        return;
      }
  
      const direccionUsando = await direccionResponse.json();
  
      if (direccionUsando && direccionUsando.idDireccion) {
        await proceedToCheckout(direccionUsando.idDireccion);
      } else {
        mostrarNotificacion('No tienes una dirección válida.', 'bg-red-500');
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      mostrarNotificacion('Error al verificar la dirección.', 'bg-red-500');
      setIsLoading(false);
    }
  };

  const clearCartUI = () => {
    setProductos([]);
  };

  const proceedToCheckout = async (idDireccion) => {
    const total = calcularTotal();
    const token = localStorage.getItem('jwt');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const idCarrito = payload.idCarrito;
    const idUsuario = payload.idUsuario;

    if (!idCarrito || !idUsuario) {
        mostrarNotificacion('Carrito o usuario no encontrados.', 'bg-red-500');
        setIsLoading(false);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/pedido`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                total,
                idCarrito,
                idUsuario,
                idDireccion,  // Aquí se está enviando el idDireccion
            }),
        });

        if (!response.ok) throw new Error('Error al proceder al pedido');

        const data = await response.json();
        if (data.success) {
            clearCartUI();
            mostrarNotificacion('Pedido realizado con éxito.', 'bg-green-500');
            updateCartCount(); 
            setIsLoading(false);
             // Navegar después de 2 segundos
              setTimeout(() => {
                navigate('/pedidos');
            }, 1200);
        } else {
            mostrarNotificacion('Error al realizar el pedido.', 'bg-red-500');
            setIsLoading(false);
            updateCartCount(); 
        }
    } catch (error) {
        mostrarNotificacion('Error al proceder con el pedido.', 'bg-red-500');
        setIsLoading(false);
        updateCartCount(); 
    }
};

  
  const actualizarCantidad = async (idDetalle, cantidad) => {
    try {
      if (isNaN(cantidad) || cantidad < 1) {
        mostrarNotificacion('La cantidad debe ser un número mayor que 0.', 'bg-red-500');
        return;
      }

      setIsLoading(true);

      const token = localStorage.getItem('jwt');
      const idUsuario = getIdUsuario(token);

      if (!token || !idUsuario) {
        mostrarNotificacion('Usuario no autenticado o token inválido.', 'bg-red-500');
        return;
      }

      const requestBody = { cantidad, idUsuario };

      const response = await fetch(`${API_BASE_URL}/api/carrito_detalle/${idDetalle}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProductos((prevProductos) =>
            prevProductos.map((producto) =>
              producto.idDetalle === idDetalle
                ? { ...producto, cantidad, subtotal: producto.precio * cantidad }
                : producto
            )
          );
          mostrarNotificacion('Cantidad y precio actualizados correctamente.', 'bg-green-500');
        } else {
          mostrarNotificacion(data.message || 'Error al actualizar la cantidad.', 'bg-red-500');
        }
      } else {
        const errorData = await response.json();
        mostrarNotificacion(errorData.message || 'Error al conectar con el servidor.', 'bg-red-500');
      }
    } catch (error) {
      mostrarNotificacion('Ocurrió un error al actualizar la cantidad.', 'bg-red-500');
    } finally {
      setIsLoading(false);
      updateCartCount();
    }
  };


  const eliminarProducto = async (idDetalle) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('jwt');

      const response = await fetch(`${API_BASE_URL}/api/carrito_detalle/${idDetalle}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          obtenerCarrito();
          mostrarNotificacion('Producto eliminado correctamente.', 'bg-green-500');
        } else {
          mostrarNotificacion('Error al eliminar el producto.', 'bg-red-500');
        }
      } else {
        mostrarNotificacion('Error al conectar con el servidor.', 'bg-red-500');
      }
    } catch (error) {
      mostrarNotificacion('Ocurrió un error al eliminar el producto.', 'bg-red-500');
    } finally {
      setIsLoading(false);
      updateCartCount();
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBarHome />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="animate-bounce-in">
            <LoadingScreen />
          </div>
        </div>
      )}
      
      {/* Notification */}
      {notification && (
        <div className="animate-fade-in-down fixed top-4 right-4 z-50">
          <Notification description={notification.description} bgColor={notification.bgColor} />
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-grow px-4 md:px-8 py-12 max-w-7xl mx-auto w-full">
        <h1 className="text-4xl font-light text-center text-gray-800 mb-12 animate-fade-in">
          Shopping Cart
        </h1>
        
        {productos.length === 0 ? (
          <div className="animate-fade-in flex flex-col justify-center items-center pt-16">
            <div className="text-center transform animate-scale-up">
              <img
                src={carritoVacio}
                alt="Empty cart"
                className="mx-auto mb-8 w-64 h-64 opacity-75"
              />
              <div className="text-3xl text-gray-400 font-light animate-fade-in">
                Your cart is empty
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32 animate-fade-in">
            {/* Products List */}
            <div className="space-y-6">
              <ProductosCarrito
                productos={productos}
                actualizarCantidad={actualizarCantidad}
                eliminarProducto={eliminarProducto}
                isLoading={isLoading}
                API_BASE_URL={API_BASE_URL}
              />
            </div>
            
            {/* Order Summary */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit animate-fade-in-down">
              <h2 className="text-2xl font-light mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>S/.{(calcularTotal() / 1.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18%)</span>
                  <span>S/.{(calcularTotal() - (calcularTotal() / 1.18)).toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-100 my-4" />
                <div className="flex justify-between text-xl font-medium">
                  <span>Total</span>
                  <span>S/.{calcularTotal().toFixed(2)}</span>
                </div>
                <button
                  className="w-full mt-6 bg-black text-white px-8 py-4 rounded-xl font-medium
                    transform transition duration-300 hover:scale-[1.02] hover:shadow-lg
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  onClick={verificarDireccionUsuario}
                  disabled={isLoading}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrito;
