import React, { useState, useEffect } from 'react'; 
import API_BASE_URL from '../../js/urlHelper';
import { useNavigate } from 'react-router-dom';
import CheckLogin from '../home/CheckLogin'; 
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLoading3Quarters } from 'react-icons/ai';
import LoadingScreen from './LoadingScreen';
import jwtUtils from '../../utilities/jwtUtils';
import { verificarYRenovarToken } from '../../js/authToken';
import { useCart } from '../../context/CartContext'; 
import SweetAlert from '../../components/SweetAlert'; // Importar SweetAlert

function DetalleProducto({ productoId, onClose }) {
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);
  const [imagenIndex, setImagenIndex] = useState(0);
  const [imageTransitioning, setImageTransitioning] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
  const navigate = useNavigate();
  const { updateCartCount } = useCart(); 

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
    setTallaSeleccionada(null); 
  };

  const handleAddToCart = () => {
    const token = jwtUtils.getTokenFromCookie();
    if (!token) {
        setShowModalLogin(true);
        return;
    }

    const idCarrito = jwtUtils.getIdCarrito(token);
    const idUsuario = jwtUtils.getIdUsuario(token);

    const precio = parseFloat(producto?.precio) || 0;

    if (!idCarrito || !idUsuario || !tallaSeleccionada) {
        SweetAlert.showMessageAlert('Error', 'Por favor selecciona una talla antes de agregar al carrito.', 'error'); // Mostrar SweetAlert de éxito
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
                return response.json().then((data) => {
                    // Si la respuesta no es exitosa, lanzamos el mensaje de error
                    throw new Error(data.message || 'Error en la respuesta del servidor');
                });
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                SweetAlert.showMessageAlert('Exito!', 'Producto agregado al carrito.', 'success'); // Mostrar SweetAlert de éxito
                updateCartCount(); 

                setCantidad(1); 
                setTallaSeleccionada(null);
            } else {
                SweetAlert.showMessageAlert('Error', 'Error al agregar al carrito.', 'error'); // Mostrar SweetAlert de éxito
            }
        })
        .catch((error) => {
            console.error('Error al agregar al carrito:', error);
            SweetAlert.showMessageAlert('Error', 'Error al conectar con el servidor.', 'error'); // Mostrar SweetAlert de éxito
        })
        .finally(() => {
            setLoading(false);
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

  const buildImageUrl = (relativePath) => {
    if (!relativePath) {
      return '/img/default-product.png';  // Si no hay imagen, mostrar la imagen predeterminada
    }
    return `${API_BASE_URL}/storage/${relativePath}`;
  };

  const handleMouseMove = (e) => {
    const zoomOverlay = document.querySelector('.zoom-overlay');
    const imageContainer = e.target;
    
    // Get image container dimensions and position
    const { left, top, width, height } = imageContainer.getBoundingClientRect();
    
    // Calculate mouse position relative to image
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // Calculate zoom position in percentage
    const zoomX = (x / width) * 100;
    const zoomY = (y / height) * 100;

    // Set zoom overlay dimensions
    const zoomWidth = 200;
    const zoomHeight = 150;
    
    // Calculate zoom overlay position to center mouse
    let zoomOverlayX = e.pageX - (zoomWidth / 2);
    let zoomOverlayY = e.pageY - (zoomHeight / 2);
    
    // Get modal boundaries
    const modalRect = imageContainer.closest('.relative').getBoundingClientRect();
    
    // Keep zoom overlay within modal bounds
    zoomOverlayX = Math.max(modalRect.left, Math.min(zoomOverlayX, modalRect.right - zoomWidth));
    zoomOverlayY = Math.max(modalRect.top, Math.min(zoomOverlayY, modalRect.bottom - zoomHeight));
    
    // Apply styles to zoom overlay
    Object.assign(zoomOverlay.style, {
        display: 'block',
        position: 'fixed',
        left: `${zoomOverlayX}px`,
        top: `${zoomOverlayY}px`,
        width: `${zoomWidth}px`,
        height: `${zoomHeight}px`,
        backgroundImage: `url(${imageContainer.src})`,
        backgroundSize: `${width * 2.5}px ${height * 2.5}px`,
        backgroundPosition: `${zoomX}% ${zoomY}%`,
        border: '2px solid black',
        borderRadius: '4px',
        pointerEvents: 'none',
        zIndex: '1000'
    });
};

const handleMouseLeave = () => {
    const zoomOverlay = document.querySelector('.zoom-overlay');
    zoomOverlay.style.display = 'none';
};

return (
    <>
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-[50] p-0 sm:p-4">
            <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl max-w-4xl relative overflow-y-auto">
                {/* Close button - adjusted for mobile */}
                <button 
                    onClick={onClose} 
                    className="fixed sm:absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white sm:bg-black/10 hover:bg-black/20 transition-colors"
                >
                    <span className="text-black text-xl">&times;</span>
                </button>

                {loading && <LoadingScreen />}

                <div className={`flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                    {/* Left column - Image */}
                    <div className="p-4 sm:p-6 md:p-8 pt-14 sm:pt-6">
                        <div className="aspect-square relative bg-gray-50 rounded-xl overflow-hidden">
                            {modeloSeleccionado?.imagenes.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors z-10"
                                    >
                                        <span className="text-black">←</span>
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors z-10"
                                    >
                                        <span className="text-black">→</span>
                                    </button>
                                </>
                            )}
                            
                            <div className="relative w-full h-full">
                                {isImageLoading && (
                                    <div className="absolute inset-0 flex justify-center items-center bg-gray-50">
                                        <AiOutlineLoading3Quarters className="animate-spin text-3xl text-black/40" />
                                    </div>
                                )}
                                <img
                                    src={buildImageUrl(modeloSeleccionado?.imagenes[imagenIndex]?.urlImagen)}
                                    alt={modeloSeleccionado?.nombreModelo}
                                    className="w-full h-full object-contain"
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={handleMouseLeave}
                                />
                            </div>
                            <div className="zoom-overlay" style={{ display: 'none' }}></div>
                        </div>
                    </div>

                    {/* Right column - Product details */}
                    <div className="px-4 sm:px-6 md:p-8 pb-6 flex flex-col h-full">
                        <h2 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">{producto?.nombreProducto}</h2>
                        
                        {/* Product price */}
                        <div className="text-lg sm:text-xl font-semibold text-black mb-4">
                            {producto?.tieneOferta ? (
                            <>
                                <span className="line-through text-gray-500 mr-2">S/.{producto.precioOriginal}</span>
                                <span className="text-red-600">S/.{producto.precioDescuento}</span>
                            </>
                            ) : (
                            <span>S/.{producto?.precioOriginal}</span>
                            )}
                        </div>

                        {modeloSeleccionado && (
                            <>
                            {/* Models selector */}
                            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                <h3 className="text-sm font-medium text-gray-500">Modelo</h3>
                                <div className="flex flex-wrap gap-2">
                                {producto?.modelos.map((modelo) => (
                                    <button
                                    key={modelo.nombreModelo}
                                    onClick={() => handleModeloChange(modelo)}
                                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                        ${modeloSeleccionado.nombreModelo === modelo.nombreModelo 
                                        ? 'bg-black text-white' 
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                    >
                                    {modelo.nombreModelo}
                                    </button>
                                ))}
                                </div>
                            </div>

                                {/* Sizes selector */}
                                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                    <h3 className="text-sm font-medium text-gray-500">Tallas disponibles</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {modeloSeleccionado.tallas.map((talla, index) => (
                                            <label 
                                                key={index} 
                                                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 rounded-lg cursor-pointer transition-colors
                                                    ${tallaSeleccionada?.nombreTalla === talla.nombreTalla 
                                                        ? 'bg-black text-white' 
                                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <span className="font-medium text-sm sm:text-base">{talla.nombreTalla}</span>
                                                <span className="text-xs sm:text-sm opacity-75">Stock: {talla.cantidad}</span>
                                                <input
                                                    type="radio"
                                                    value={talla.nombreTalla}
                                                    checked={tallaSeleccionada?.nombreTalla === talla.nombreTalla}
                                                    onChange={() => setTallaSeleccionada(talla)}
                                                    className="sr-only"
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity selector */}
                                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                    <h3 className="text-sm font-medium text-gray-500">Cantidad</h3>
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={handleDecrease}
                                            className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                        >
                                            <AiOutlineMinus className="text-gray-600" />
                                        </button>
                                        <input
                                            type="number"
                                            value={cantidad}
                                            onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-14 sm:w-16 h-8 sm:h-10 text-center border border-gray-200 rounded-lg text-gray-800"
                                        />
                                        <button 
                                            onClick={handleIncrease}
                                            className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                        >
                                            <AiOutlinePlus className="text-gray-600" />
                                        </button>
                                    </div>
                                </div>

                                <div className="w-full p-4 bg-white border-t border-gray-100 sm:p-0 sm:bg-transparent sm:border-0">
                                    <div className="sm:relative sm:bottom-0 sm:left-0 sm:right-0">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={loading}
                                            className={`w-full bg-black text-white py-3 sm:py-4 rounded-xl font-medium
                                                hover:bg-black/90 transition-colors
                                                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {loading ? 'Agregando...' : 'Agregar al carrito'}
                                        </button>
                                    </div>
                                </div>


                            </>
                        )}

                        {!loading && error && (
                            <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {showModalLogin && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50">
                <CheckLogin setShowModal={handleCloseModalLogin} />
            </div>
        )}
    </>
);
}

export default DetalleProducto;
