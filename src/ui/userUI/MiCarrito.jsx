import React, { useEffect, useState } from 'react';
import NavBarHome from '../../components/home/NavBarHome';
import LoadingScreen from '../../components/home/LoadingScreen';
import Notification from '../../components/home/Notificacion';
import { verificarYRenovarToken } from '../../js/authToken';
import API_BASE_URL from '../../js/urlHelper';

function Carrito() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const obtenerCarrito = async () => {
      try {
        // Primero verificamos y renovamos el token si es necesario
        await verificarYRenovarToken();

        // Realizamos la solicitud a la API para obtener los productos del carrito
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
            setProductos(data.data); // Guardamos los productos en el estado
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
        setIsLoading(false); // Hacemos que la pantalla de carga se oculte
      }
    };

    obtenerCarrito();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-800">
      {/* Barra de navegación */}
      <NavBarHome />

      {/* Pantalla de carga */}
      {isLoading && <LoadingScreen />}

      {/* Notificación */}
      {notification && (
        <Notification
          description={notification.description}
          bgColor={notification.bgColor}
        />
      )}

      <div className="flex-grow px-6 py-8">
        <h1 className="text-3xl font-semibold text-center text-black mb-6">Carrito de Compras</h1>

        {productos.length === 0 ? (
          <div className="text-center text-xl text-gray-600">Tu carrito está vacío.</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {productos.map((producto) => (
              <div
                key={producto.idProducto}
                className="bg-white p-4 rounded-lg shadow-md w-full sm:w-80 md:w-96"
              >
                <img
                  src={`${API_BASE_URL}/storage/${producto.imagen}`} // Asegúrate de que la URL esté bien formada
                  alt={producto.nombreProducto}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-semibold text-black">{producto.nombreProducto}</h2>
                <p className="text-gray-600 text-sm mb-2">{producto.descripcion}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-black">${producto.precio.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">x {producto.cantidad} = ${producto.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    onClick={() => alert('Editar cantidad')}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    onClick={() => alert('Eliminar producto')}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-100 p-4 text-center text-gray-600">
        <p>&copy; 2024 - Todos los derechos reservados</p>
      </div>
    </div>
  );
}

export default Carrito;
