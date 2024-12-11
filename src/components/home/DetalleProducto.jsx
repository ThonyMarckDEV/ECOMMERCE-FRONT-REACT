import React, { useState, useEffect } from 'react'; 
import API_BASE_URL from '../../js/urlHelper';
import { useNavigate } from 'react-router-dom';
import CheckLogin from '../home/CheckLogin'; 
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLoading3Quarters } from 'react-icons/ai';
import LoadingScreen from './LoadingScreen';
import jwtUtils from '../../utilities/jwtUtils';
import Notification from '../../components/home/Notificacion';
import { verificarYRenovarToken } from '../../js/authToken';
import { useCart } from '../../context/CartContext'; // Asegúrate de importar correctamente

function DetalleProducto({ productoId, onClose }) {
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [notification, setNotification] = useState(null);
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);
  const [imagenIndex, setImagenIndex] = useState(0);
  const [imageTransitioning, setImageTransitioning] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);  // Nuevo estado para la talla seleccionada
  const navigate = useNavigate();
  const { updateCartCount } = useCart(); // Usamos el contexto de carrito
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    fetch(`${API_BASE_URL}/api/productos?idProducto=${productoId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los detalles del producto');
        }
        return response.json();
      })
      .then((data) => {
        setProducto(data.data);
        setModeloSeleccionado(data.data.modelos[0]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [productoId]);

  const buildImageUrl = (relativePath) => `${API_BASE_URL}/storage/${relativePath}`;

  const handleIncrease = () => {
    setCantidad((prevCantidad) => prevCantidad + 1);
  };

  const handleDecrease = () => {
    setCantidad((prevCantidad) => (prevCantidad > 1 ? prevCantidad - 1 : 1));
  };

  const handleModeloChange = (modelo) => {
    setModeloSeleccionado(modelo);
    setImagenIndex(0);
    setIsImageLoading(true);
    setTallaSeleccionada(null);  // Reiniciar la talla seleccionada cuando cambie el modelo
  };

  const handleAddToCart = () => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      setShowModalLogin(true);
      return;
    }
  
    const idCarrito = jwtUtils.getIdCarrito(token);
    const idUsuario = jwtUtils.getIdUsuario(token);
  
    // Aseguramos que el precio sea un número flotante
    const precio = parseFloat(producto?.precio) || 0;
  
    if (!idCarrito || !idUsuario || !tallaSeleccionada) {
      setNotification({
        message: 'Por favor selecciona una talla antes de agregar al carrito',
        color: 'bg-red-400'
      });
      return;
    }
  
    const data = {
      idProducto: productoId,
      cantidad: cantidad,
      idCarrito: idCarrito,
      idUsuario: idUsuario,
      idModelo: modeloSeleccionado.idModelo,
      idTalla: tallaSeleccionada.idTalla,
    };
  
    setLoading(true);
    verificarYRenovarToken();
  
    fetch(`${API_BASE_URL}/api/agregarCarrito`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setNotification({
            message: 'Producto agregado al carrito',
            color: 'bg-green-400'
          });
  
          // Llamada a updateCartCount para actualizar la cantidad del carrito en el contexto
          updateCartCount(); // Ahora funciona correctamente
  
          // Reiniciar cantidad y desmarcar talla seleccionada
          setCantidad(1); // Reset cantidad
          setTallaSeleccionada(null); // Desmarcar la talla
        } else {
          setNotification({
            message: 'Error al agregar al carrito',
            color: 'bg-red-400'
          });
        }
      })
      .catch((error) => {
        console.error('Error al agregar al carrito:', error);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => setNotification(null), 1500);
      });
  };

  const handleCloseModalLogin = () => {
    setShowModalLogin(false);
  };

  const handleNextImage = () => {
    setImageTransitioning(true);
    setTimeout(() => {
      setImagenIndex((prevIndex) => (prevIndex + 1) % modeloSeleccionado.imagenes.length);
      setImageTransitioning(false);
      setIsImageLoading(true);
    }, 300);
  };

  const handlePrevImage = () => {
    setImageTransitioning(true);
    setTimeout(() => {
      setImagenIndex((prevIndex) => (prevIndex - 1 + modeloSeleccionado.imagenes.length) % modeloSeleccionado.imagenes.length);
      setImageTransitioning(false);
      setIsImageLoading(true);
    }, 300);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = (e) => {
    e.target.src = '/img/default-product.png';
    setIsImageLoading(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-30">
        <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-lg sm:max-w-3xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 text-2xl hover:text-gray-700">&times;</button>
          {loading && <LoadingScreen />}
          <div className={`relative ${loading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <h2 className="text-3xl font-bold mb-4 text-center sm:text-left text-black">{producto?.nombreProducto}</h2>

            {modeloSeleccionado && (
              <div className="mb-6">
                <div className="flex space-x-4 mb-4">
                  {producto?.modelos.map((modelo) => (
                    <button
                      key={modelo.nombreModelo}
                      onClick={() => handleModeloChange(modelo)}
                      className={`px-4 py-2 rounded-md ${modeloSeleccionado.nombreModelo === modelo.nombreModelo ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
                    >
                      {modelo.nombreModelo}
                    </button>
                  ))}
                </div>

                <div className="w-full h-80 mb-3 relative bg-white flex items-center justify-center">
                  {modeloSeleccionado.imagenes.length > 1 && (
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-0 px-4 py-2 bg-black text-white rounded-md"
                    >
                      {'<'}
                    </button>
                  )}
                  <div className={`transition-opacity duration-300 ${imageTransitioning ? 'opacity-0' : 'opacity-100'} w-full h-full`}>
                    {isImageLoading && (
                      <div className="absolute inset-0 flex justify-center items-center bg-white rounded-md">
                        <AiOutlineLoading3Quarters className="animate-spin text-3xl text-black" />
                      </div>
                    )}
                    <img
                      src={buildImageUrl(modeloSeleccionado.imagenes[imagenIndex]?.urlImagen || '/img/default-product.png')}
                      alt={modeloSeleccionado.nombreModelo}
                      className="w-full h-full object-contain rounded-md"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  </div>
                  {modeloSeleccionado.imagenes.length > 1 && (
                    <button
                      onClick={handleNextImage}
                      className="absolute right-0 px-4 py-2 bg-black text-white rounded-md"
                    >
                      {'>'}
                    </button>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-lg font-semibold">Tallas disponibles:</p>
                  <div className="space-y-2">
                    {modeloSeleccionado.tallas.map((talla, index) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={talla.nombreTalla}
                          checked={tallaSeleccionada?.nombreTalla === talla.nombreTalla}
                          onChange={() => setTallaSeleccionada(talla)} // Actualizar la talla seleccionada
                          className="text-black"
                        />
                        <span>{talla.nombreTalla} - {talla.cantidad} unidades</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center mb-6 justify-center sm:justify-start">
              <button onClick={handleDecrease} className="px-4 py-2 bg-black text-white rounded-l-md text-xl"> <AiOutlineMinus /></button>
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center border-t border-b border-gray-300 text-xl mx-2 text-black"
              />
              <button onClick={handleIncrease} className="px-4 py-2 bg-black text-white rounded-r-md text-xl"> <AiOutlinePlus /></button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full bg-black text-white py-3 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Agregando...' : 'Agregar al carrito'}
            </button>
          </div>
          {!loading && error && <p className="text-red-500 text-center mt-4">Error: {error}</p>}
        </div>
      </div>

      {showModalLogin && <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"><CheckLogin setShowModal={handleCloseModalLogin} /></div>}
      {notification && <Notification description={notification.message} bgColor={notification.color} />}
    </>
  );
}

export default DetalleProducto;
