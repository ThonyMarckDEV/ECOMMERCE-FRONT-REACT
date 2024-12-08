import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../js/urlHelper';
import { useNavigate } from 'react-router-dom';
import CheckLogin from '../home/CheckLogin'; // Asegúrate de que la ruta es correcta
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'; // Íconos para los botones de cantidad
import LoadingScreen from './LoadingScreen'; // Asegúrate de que la ruta es correcta
import jwtUtils from '../../utilities/jwtUtils'; // Importamos el archivo de utilidades JWT
import Notification from '../../components/home/Notificacion'; // Importar el componente de notificación
import { verificarYRenovarToken } from '../../js/authToken';


function DetalleProducto({ productoId, onClose }) {
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null); // Estado para manejar la notificación

  useEffect(() => {
    // Bloquear el desplazamiento del body cuando el modal esté abierto
    document.body.style.overflow = 'hidden';
    // Fetch detalles del producto usando el productoId
    fetch(`${API_BASE_URL}/api/productos?idProducto=${productoId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los detalles del producto');
        }
        return response.json();
      })
      .then((data) => {
        setProducto(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Limpiar el estilo al desmontar el componente o cerrar el modal
    return () => {
      document.body.style.overflow = 'auto'; // Restaurar el desplazamiento cuando se cierre el modal
    };
  }, [productoId]);

  const handleIncrease = () => {
    setCantidad((prevCantidad) => prevCantidad + 1);
  };

  const handleDecrease = () => {
    setCantidad((prevCantidad) => (prevCantidad > 1 ? prevCantidad - 1 : 1));
  };

  const handleAddToCart = () => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      setShowModalLogin(true); // Muestra el modal si no hay token
      return;
    }

    const idCarrito = jwtUtils.getIdCarrito(token); // Obtener el idCarrito desde el token
    const idUsuario = jwtUtils.getIdUsuario(token); // Obtener el idUsuario desde el token
    const precio = producto?.precio || 0; // Obtener el precio del producto

    if (!idCarrito || !idUsuario) {
      console.error('No se pudo obtener el idCarrito o idUsuario desde el token');
      return;
    }

    // Datos a enviar al backend
    const data = {
      idProducto: productoId,
      cantidad: cantidad,
      idCarrito: idCarrito,
      idUsuario: idUsuario,
      precio: precio
    };

    // Activar el loading
    setLoading(true);
     // Primero verificamos y renovamos el token si es necesario
     verificarYRenovarToken();
    // Realizar la petición POST al backend
    fetch(`${API_BASE_URL}/api/agregarCarrito`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Agregamos el token en el header como Bearer
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('Producto agregado al carrito');
          setNotification({
            message: 'Producto agregado al carrito',
            color: 'bg-green-400', // Color de la notificación (verde claro)
          });
        } else {
          console.error('Error al agregar al carrito:', data.message);
          setNotification({
            message: 'Error al agregar al carrito',
            color: 'bg-red-400', // Color de la notificación (rojo)
          });
        }
      })
      .catch((error) => {
        console.error('Error al agregar al carrito:', error);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setNotification(null); // Limpiar la notificación después de un tiempo
          window.location.reload();
        }, 1500);
      });
  };

  const handleCloseModalLogin = () => {
    setShowModalLogin(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-30">
        <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-lg sm:max-w-3xl relative">
          {/* Botón de cerrar dentro del modal */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 text-2xl hover:text-gray-700 transition-colors"
          >
            &times;
          </button>

          {/* Loader overlay */}
          {loading && <LoadingScreen />}

          {/* Contenido del producto, oculto cuando loading */}
          <div className={`relative ${loading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <h2 className="text-3xl font-bold mb-4 text-center sm:text-left text-black">
              {producto?.nombreProducto}
            </h2>

            <div className="w-full h-80 mb-3 relative bg-gray-100 flex items-center justify-center">
              {producto && (
                <img
                  src={`${API_BASE_URL}/storage/${producto.imagen}`}
                  alt={producto.nombreProducto}
                  className="w-full h-full object-contain rounded-md"
                  onError={(e) => {
                    e.target.onerror = null; // Evita loops infinitos
                    e.target.src = '/images/default-product.jpg'; // Ruta a una imagen por defecto
                  }}
                />
              )}
            </div>

            <p className="text-gray-700 mb-4">{producto?.descripcion}</p>

            <p className="text-xl font-semibold text-gray-800 mb-4">S/.{producto?.precio}</p>

            <p className="text-sm text-gray-500 mb-4">Categoría: {producto?.nombreCategoria}</p>

            {/* Selector de cantidad */}
            <div className="flex items-center mb-6 justify-center sm:justify-start">
              <button
                onClick={handleDecrease}
                className="px-4 py-2 bg-black text-white rounded-l-md text-xl hover:bg-gray-700 transition-colors"
              >
                <AiOutlineMinus />
              </button>
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center border-t border-b border-gray-300 text-xl mx-2 text-black"
              />
              <button
                onClick={handleIncrease}
                className="px-4 py-2 bg-black text-white rounded-r-md text-xl hover:bg-gray-700 transition-colors"
              >
                <AiOutlinePlus />
              </button>
            </div>

            {/* Botón de agregar al carrito */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-700 transition-colors mt-4"
            >
              Agregar al carrito
            </button>
          </div>

          {/* Mensaje en caso de error */}
          {!loading && error && (
            <p className="text-red-500 text-center mt-4">
              Error: {error}
            </p>
          )}
        </div>
      </div>

      {/* Modal de inicio de sesión */}
      {showModalLogin && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <CheckLogin setShowModal={handleCloseModalLogin} />
        </div>
      )}

      {/* Notificación */}
      {notification && (
        <Notification description={notification.message} bgColor={notification.color} />
      )}

    </>
  );
}

export default DetalleProducto;
