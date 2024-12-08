import React, { useEffect, useState } from 'react';
import NavBarHome from '../../components/home/NavBarHome';
import LoadingScreen from '../../components/home/LoadingScreen';
import Notification from '../../components/home/Notificacion';
import { verificarYRenovarToken } from '../../js/authToken';
import API_BASE_URL from '../../js/urlHelper';

function Carrito() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false); // Nuevo estado para controlar el cargando de actualización
  
  useEffect(() => {
    const obtenerCarrito = async () => {
      try {
        await verificarYRenovarToken();
        setIsLoading(true);
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${API_BASE_URL}/api/carrito`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProductos(data.data);
          } else {
            setNotification({
              description: 'No se pudo cargar el carrito.',
              bgColor: 'bg-red-500',
            });
          }
        } else {
          setNotification({
            description: 'Error al obtener los productos del carrito.',
            bgColor: 'bg-red-500',
          });
        }
      } catch (error) {
        console.error('Error al obtener el carrito:', error);
        setNotification({
          description: 'Ocurrió un error al obtener los productos.',
          bgColor: 'bg-red-500',
        });
      } finally {
        setIsLoading(false);
      }
    };

    obtenerCarrito();
  }, []);

  const calcularTotal = () => {
    return productos.reduce((total, producto) => total + producto.subtotal, 0);
  };

     // Función para actualizar la cantidad de un producto
  const actualizarCantidad = async (idProducto, cantidad) => {
    try {

      // Verificamos si la cantidad es válida
      if (cantidad < 1) {
        setNotification({
          description: 'La cantidad no puede ser menor a 1.',
          bgColor: 'bg-red-500',
        });
        setIsLoading(false);
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
          setNotification({
            description: 'Cantidad actualizada correctamente.',
            bgColor: 'bg-green-500',
          });

          // Actualizamos el carrito en el estado con la nueva cantidad
          setProductos((prevProductos) =>
            prevProductos.map((producto) =>
              producto.idProducto === idProducto
                ? { ...producto, cantidad, subtotal: producto.precio * cantidad }
                : producto
            )
          );

          // Si la cantidad llega a 0, eliminamos el producto
          if (cantidad < 1) {
            eliminarProducto(idProducto);
          }
          setIsLoading(false);
          // Recargamos la página después de 2 segundos
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else {
          setIsLoading(false);
          setNotification({
            description: data.message || 'Error al actualizar la cantidad.',
            bgColor: 'bg-red-500',
          });
        }
      } else {
        setIsLoading(false);
        setNotification({
          description: 'Error al conectar con el servidor.',
          bgColor: 'bg-red-500',
        });
      }
    } catch (error) {
      console.error('Error al actualizar la cantidad:', error);
      setNotification({
        description: 'Ocurrió un error al actualizar la cantidad.',
        bgColor: 'bg-red-500',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para eliminar un producto del carrito
  const eliminarProducto = async (idProducto) => {
    try {
      setIsLoading(true); // Desactivamos el loader
      const token = localStorage.getItem('jwt');
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
          setNotification({
            description: 'Producto eliminado correctamente.',
            bgColor: 'bg-green-500',
          });
          setIsLoading(false); // Desactivamos el loader
          // Actualizamos el carrito para eliminar el producto
          setProductos((prevProductos) =>
            prevProductos.filter((producto) => producto.idProducto !== idProducto)
          );
            // Recargamos la página después de 2 segundos
            setTimeout(() => {
              window.location.reload();
            }, 1200);
        } else {
          setIsLoading(false); // Desactivamos el loader
          setNotification({
            description: 'Error al eliminar el producto.',
            bgColor: 'bg-red-500',
          });
           // Recargamos la página después de 2 segundos
           setTimeout(() => {
            window.location.reload();
          }, 1200);
        }
      } else {
        setIsLoading(false); // Desactivamos el loader
        setNotification({
          description: 'Error al conectar con el servidor.',
          bgColor: 'bg-red-500',
        });
          // Recargamos la página después de 2 segundos
          setTimeout(() => {
            window.location.reload();
          }, 1200);
      }
    } catch (error) {
      setIsLoading(false); // Desactivamos el loader
      console.error('Error al eliminar el producto:', error);
      setNotification({
        description: 'Ocurrió un error al eliminar el producto.',
        bgColor: 'bg-red-500',
      });
        // Recargamos la página después de 2 segundos
        setTimeout(() => {
          window.location.reload();
        }, 1200);
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
          <div className="flex flex-wrap justify-center gap-6">
            {productos.map((producto) => (
              <div key={producto.idProducto} className="bg-white p-4 rounded-lg shadow-md w-full sm:w-80 md:w-96">
                <img
                  src={`${API_BASE_URL}/storage/${producto.imagen}`}
                  alt={producto.nombreProducto}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-semibold text-black">{producto.nombreProducto}</h2>
                <p className="text-gray-600 text-sm mb-2">{producto.descripcion}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-black">${producto.precio.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">
                    x {producto.cantidad} = ${producto.subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <button
                      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                      onClick={() => actualizarCantidad(producto.idProducto, producto.cantidad - 1)}
                      disabled={loadingUpdate}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={producto.cantidad}
                      onChange={(e) =>
                        actualizarCantidad(producto.idProducto, parseInt(e.target.value) || 1)
                      }
                      className="mx-2 w-16 text-center border-2 border-gray-300 rounded-lg"
                      min="1"
                    />
                    <button
                      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                      onClick={() => actualizarCantidad(producto.idProducto, producto.cantidad + 1)}
                      disabled={loadingUpdate}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    onClick={() => eliminarProducto(producto.idProducto)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total y Botón de Realizar pedido */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-900 p-4 text-white flex justify-between items-center">
        <div className="text-xl font-semibold">
          <span>Total: </span>
          <span>${calcularTotal().toFixed(2)}</span>
        </div>
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          onClick={() => alert('Realizar pedido')}
        >
          Realizar pedido
        </button>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 p-4 text-center text-gray-600">
        <p>&copy; 2024 - Todos los derechos reservados</p>
      </div>
    </div>
  );
}

export default Carrito;
