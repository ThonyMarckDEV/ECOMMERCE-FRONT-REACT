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
  
      const response = await fetch(`${API_BASE_URL}/api/listarDireccionPedido/${idUsuario}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Si la respuesta no es exitosa
      if (!response.ok) {
        const data = await response.json();
        mostrarNotificacion(data.message || 'Error al verificar la dirección', 'bg-red-500');
        setIsLoading(false);
        return;
      }
  
      const direccionUsando = await response.json();
      console.log('Dirección Usando:', direccionUsando);  // Asegúrate de ver la respuesta completa
  
      // Verifica si se encontró la dirección 'usando'
      if (direccionUsando && direccionUsando.idDireccion) {
        // La respuesta ya es un objeto, no es necesario usar [0]
        await proceedToCheckout(direccionUsando.idDireccion);  // Ahora se está extrayendo correctamente el idDireccion
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

    // Verificar el valor de idDireccion
    console.log('ID Dirección:', idDireccion);

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
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-800">
      <NavBarHome />
    
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <LoadingScreen /> {/* Asegúrate de que LoadingScreen esté centrado */}
        </div>
      )}
    
      {notification && <Notification description={notification.description} bgColor={notification.bgColor} />}
    
      <div className="flex-grow px-6 py-8">
        <h1 className="text-3xl font-semibold text-center text-black mb-6">Carrito de Compras</h1>
    
        {productos.length === 0 ? (
          <div className="flex flex-col justify-center items-center pt-16">
            <div className="text-center">
              <img
                src={carritoVacio}
                alt="Carrito vacío"
                className="mx-auto mb-8 w-80 h-80 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
              />
              <div className="text-3xl sm:text-4xl text-gray-600 font-semibold">
                Tu carrito está vacío.
              </div>
            </div>
          </div>
        ) : (
          // Cambiar grid por flex
          <div className="flex flex-wrap justify-start gap-6 mb-16">
            <ProductosCarrito
              productos={productos}
              actualizarCantidad={actualizarCantidad}
              eliminarProducto={eliminarProducto}
              isLoading={isLoading}
              API_BASE_URL={API_BASE_URL}
            />
          </div>
        )}
      </div>
  
      {productos.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 sm:p-6 text-black flex justify-between items-center shadow-xl rounded-tl-3xl rounded-tr-3xl border-t-4 border-gray-200">
          <div className="text-lg sm:text-xl font-semibold flex items-center space-x-4">
            <span className="text-sm sm:text-lg font-medium text-gray-600">Total (IGV 18%):</span>
            <span className="text-xl sm:text-2xl font-bold text-black">
              S/.{calcularTotal().toFixed(2)}
            </span>
          </div>
          <button
            className="bg-gradient-to-r from-black to-gray-800 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg shadow-lg hover:from-gray-800 hover:to-black transform transition duration-300 ease-in-out focus:outline-none"
            onClick={verificarDireccionUsuario}
            disabled={isLoading}
          >
            Realizar pedido
          </button>

        </div>
      )}

    </div>
  );
}

export default Carrito;
