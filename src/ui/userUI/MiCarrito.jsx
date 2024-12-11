import React, { useEffect, useState } from 'react';
import NavBarHome from '../../components/home/NavBarHome';
import LoadingScreen from '../../components/home/LoadingScreen';
import Notification from '../../components/home/Notificacion';
import ProductosCarrito from '../../components/userComponents/ProductosCarrito';
import { verificarYRenovarToken } from '../../js/authToken';
import API_BASE_URL from '../../js/urlHelper';
import jwtUtils from '../../utilities/jwtUtils';
import { useCart } from '../../context/CartContext'; // Asegúrate de importar correctamente

function Carrito() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [lastAction, setLastAction] = useState(null); // Variable para evitar notificaciones repetidas
  const { updateCartCount } = useCart(); // Usamos el contexto de carrito

  const mostrarNotificacion = (descripcion, color) => {
    // Si ya se ha mostrado la misma notificación, no mostrarla de nuevo
    if (lastAction === descripcion) return;
  
    setNotification({ description: descripcion, bgColor: color });
    setLastAction(descripcion); // Registrar la última acción
  
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
      const idUsuario = jwtUtils.getIdUsuario(token);

      if (!idUsuario) {
        throw new Error("No se pudo obtener el ID del usuario.");
      }

      console.log("IdUsuario:", idUsuario);

      // Cambiamos la solicitud para enviar el idUsuario en el cuerpo
      const response = await fetch(`${API_BASE_URL}/api/carrito`, {
        method: 'POST', // Cambia a POST para incluir un cuerpo
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ idUsuario }), // Enviamos el idUsuario en el cuerpo
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProductos(data.data);
        } else {
          mostrarNotificacion('No se pudo cargar el carrito.', 'bg-red-500');
        }
      } else {
        setNotification({
          description: 'Error al obtener los productos del carrito.',
          bgColor: 'bg-red-500',
        });
      }
    } catch (error) {
      setNotification({
        description: 'Ocurrió un error al obtener los productos.',
        bgColor: 'bg-red-500',
      });
    } finally {
      setIsLoading(false);
      setNotification(null);
    }
  };

  useEffect(() => {
    obtenerCarrito();
  }, []);

  const calcularTotal = () => {
    // Asegurarse de que el valor de cada subtotal es un número
    const total = productos.reduce((total, producto) => {
      const subtotal = producto.subtotal || 0;  // En caso de que el subtotal sea undefined o null, se asigna 0
      return total + parseFloat(subtotal);  // Aseguramos que el subtotal sea un número
    }, 0);

    return total;
  };

  const verificarDireccionUsuario = async () => {
    setIsLoading(true);
    try {
      await verificarYRenovarToken();
      const token = localStorage.getItem('jwt');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const idUsuario = payload.idUsuario;

      const response = await fetch(`${API_BASE_URL}/api/listarDireccion/${idUsuario}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Error al verificar la dirección');
      const direcciones = await response.json();
      const direccionUsando = direcciones.find((d) => d.estado === 'usando');

      if (direccionUsando) {
        await proceedToCheckout(direccionUsando.idDireccion);
      } else {
        setNotification({ description: 'No tienes una dirección válida.', bgColor: 'bg-red-500' });
        setIsLoading(false); // Desactiva el loader si no hay dirección válida
      }
    } catch (error) {
      console.error(error);
      setNotification({ description: 'Error al verificar la dirección.', bgColor: 'bg-red-500' });
      setIsLoading(false); // Desactiva el loader si ocurre un error
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
      setNotification({ description: 'Carrito o usuario no encontrados.', bgColor: 'bg-red-500' });
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
          idDireccion,
        }),
      });

      if (!response.ok) throw new Error('Error al proceder al pedido');

      const data = await response.json();
      if (data.success) {
        clearCartUI();
        setNotification({ description: 'Pedido realizado con éxito.', bgColor: 'bg-green-500' });
        setTimeout(() => {
          window.location.reload(); // Recarga la página
        }, 2000);
      } else {
        setNotification({ description: 'Error al realizar el pedido.', bgColor: 'bg-red-500' });
        setIsLoading(false); // Desactiva el loader si ocurre un error
      }
    } catch (error) {
      console.error(error);
      setNotification({ description: 'Error al proceder con el pedido.', bgColor: 'bg-red-500' });
      setIsLoading(false); // Desactiva el loader si ocurre un error
    }
  };

  const actualizarCantidad = async (idProducto, cantidad) => {
    try {
      if (cantidad < 1) {
        setNotification({ description: 'La cantidad no puede ser menor a 1.', bgColor: 'bg-red-500' });
        return;
      }

      setIsLoading(true);
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${API_BASE_URL}/api/carrito_detalle/${idProducto}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ cantidad }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProductos((prevProductos) =>
            prevProductos.map((producto) =>
              producto.idProducto === idProducto
                ? { 
                    ...producto, 
                    cantidad, 
                    subtotal: producto.precio * cantidad  // Actualizamos el subtotal correctamente
                  }
                : producto
            )
          );
          setNotification({ description: 'Cantidad y precio actualizados correctamente.', bgColor: 'bg-green-500' });
        } else {
          setNotification({ description: data.message || 'Error al actualizar la cantidad.', bgColor: 'bg-red-500' });
        }
      } else {
        setNotification({ description: 'Error al conectar con el servidor.', bgColor: 'bg-red-500' });
      }
    } catch (error) {
      console.error('Error al actualizar la cantidad:', error);
      setNotification({ description: 'Ocurrió un error al actualizar la cantidad.', bgColor: 'bg-red-500' });
    } finally {
      setIsLoading(false);
       // Llamada a updateCartCount para actualizar la cantidad del carrito en el contexto
       updateCartCount(); // Ahora funciona correctamente
    }
  };

  // Función eliminarProducto modificada para llamar a obtenerCarrito después de eliminar
  const eliminarProducto = async (idProducto) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('jwt');
      
      // Realizar la eliminación del producto
      const response = await fetch(`${API_BASE_URL}/api/carrito_detalle/${idProducto}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Llamar a la función obtenerCarrito para actualizar los productos del carrito
          obtenerCarrito();
          setNotification({ description: 'Producto eliminado correctamente.', bgColor: 'bg-green-500' });
        } else {
          setNotification({ description: 'Error al eliminar el producto.', bgColor: 'bg-red-500' });
        }
      } else {
        setNotification({ description: 'Error al conectar con el servidor.', bgColor: 'bg-red-500' });
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      setNotification({ description: 'Ocurrió un error al eliminar el producto.', bgColor: 'bg-red-500' });
    } finally {
      setIsLoading(false);
       // Llamada a updateCartCount para actualizar la cantidad del carrito en el contexto
       updateCartCount(); // Ahora funciona correctamente
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-800">
      <NavBarHome />

      {isLoading && <LoadingScreen />}
      {notification && <Notification description={notification.description} bgColor={notification.bgColor} />}

      <div className="flex-grow px-6 py-8">
        <h1 className="text-3xl font-semibold text-center text-black mb-6">Carrito de Compras</h1>

        {productos.length === 0 ? (
          <div className="text-center text-xl text-gray-600">Tu carrito está vacío.</div>
        ) : (
          <ProductosCarrito
            productos={productos}
            actualizarCantidad={actualizarCantidad}
            eliminarProducto={eliminarProducto}
            isLoading={isLoading}
            API_BASE_URL={API_BASE_URL}
          />
        )}
      </div>

      {productos.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 p-4 text-white flex justify-between items-center">
          <div className="text-xl font-semibold">
            <span>Total: </span>
            <span>S/.{calcularTotal().toFixed(2)}</span> {/* Aquí se usa toFixed con la validación previa */}
          </div>
          <button
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
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
