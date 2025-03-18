import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../js/urlHelper';
import { useNavigate } from 'react-router-dom';
import CheckLogin from '../home/CheckLogin';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLoading3Quarters } from 'react-icons/ai';
import LoadingScreen from './LoadingScreen';
import jwtUtils from '../../utilities/jwtUtils';
import { verificarYRenovarToken } from '../../js/authToken';
import { useCart } from '../../context/CartContext';
import SweetAlert from '../../components/SweetAlert';
import { FaShareAlt } from "react-icons/fa"; // Importar el ícono de compartir

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
  const [caracteristicas, setCaracteristicas] = useState(null); // Estado para características
  const [isCharacteristicsExpanded, setIsCharacteristicsExpanded] = useState(false);
  const navigate = useNavigate();
  const { updateCartCount } = useCart();

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Obtener detalles del producto
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

    // Obtener características del producto
    fetch(`${API_BASE_URL}/api/productos/${productoId}/caracteristicas`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener las características del producto');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setCaracteristicas(data.data.caracteristicas);
        }
      })
      .catch((err) => {
        console.error('Error al obtener características:', err);
      });

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [productoId]);

  const generarEnlaceCompartir = () => {
    const nombreProducto = producto?.nombreProducto || "Este producto";
    const urlProducto = `${window.location.origin}/productos?texto=${encodeURIComponent(nombreProducto)}`;
    const mensaje = `¡Mira ${nombreProducto} que encontré! 🛍️✨`;
    return { mensaje, urlProducto };
  };

  const handleCompartir = async () => {
    const { mensaje, urlProducto } = generarEnlaceCompartir();

    if (navigator.share) {
      try {
        await navigator.share({
          title: producto?.nombreProducto || "Producto",
          text: mensaje,
          url: urlProducto,
        });
      } catch (error) {
        console.error("Error al compartir:", error);
      }
    } else {
      const opciones = [
        {
          nombre: "WhatsApp",
          accion: () => {
            const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${mensaje}\n\n${urlProducto}`)}`;
            window.open(url, "_blank");
          },
        },
        {
          nombre: "Facebook",
          accion: () => {
            const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlProducto)}&quote=${encodeURIComponent(mensaje)}`;
            window.open(url, "_blank");
          },
        },
        {
          nombre: "Copiar enlace",
          accion: () => {
            navigator.clipboard.writeText(`${mensaje}\n\n${urlProducto}`);
            alert("Enlace copiado al portapapeles.");
          },
        },
      ];

      const opcionSeleccionada = prompt(
        "Elige una opción para compartir:\n" +
          opciones.map((opcion, index) => `${index + 1}. ${opcion.nombre}`).join("\n")
      );

      if (opcionSeleccionada) {
        const opcion = opciones[parseInt(opcionSeleccionada) - 1];
        if (opcion) opcion.accion();
      }
    }
  };

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

    const isTallaEspecial = modeloSeleccionado.tallas.some(
      (talla) => talla.nombreTalla === "Stock" || talla.nombreTalla === "Sin talla"
    );

    let idTalla;
    if (isTallaEspecial) {
      const tallaEspecial = modeloSeleccionado.tallas.find(
        (talla) => talla.nombreTalla === "Stock" || talla.nombreTalla === "Sin talla"
      );
      idTalla = tallaEspecial?.idTalla || null;
    } else {
      if (!tallaSeleccionada) {
        SweetAlert.showMessageAlert('Error', 'Por favor selecciona una talla antes de agregar al carrito.', 'error');
        return;
      }
      idTalla = tallaSeleccionada.idTalla;
    }

    const data = {
      idProducto: productoId,
      cantidad: cantidad,
      idCarrito: idCarrito,
      idUsuario: idUsuario,
      idModelo: modeloSeleccionado.idModelo,
      idTalla: idTalla,
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
            throw new Error(data.message || 'Error en la respuesta del servidor');
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          SweetAlert.showMessageAlert('Éxito!', 'Producto agregado al carrito.', 'success');
          updateCartCount();
          setCantidad(1);
          setTallaSeleccionada(null);
        } else {
          SweetAlert.showMessageAlert('Error', 'Error al agregar al carrito.', 'error');
        }
      })
      .catch((error) => {
        console.error('Error al agregar al carrito:', error);
        SweetAlert.showMessageAlert('Error', 'Error al conectar con el servidor.', 'error');
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
      return '/img/default-product.png';
    }
    return `${API_BASE_URL}/storage/${relativePath}`;
  };

  const handleMouseMove = (e) => {
    const image = e.target;
    const container = image.parentElement;
    const { width, height } = container.getBoundingClientRect();
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / width;
    const y = (e.clientY - rect.top) / height;
    const transformX = (x - 0.5) * 200;
    const transformY = (y - 0.5) * 200;
    image.style.transform = `scale(3) translate(${-transformX}px, ${-transformY}px)`;
    image.style.transition = 'none';
  };

  const handleMouseLeave = (e) => {
    const image = e.target;
    image.style.transform = 'scale(1) translate(0, 0)';
    image.style.transition = 'transform 0.3s ease';
  };

  const handleMouseEnter = (e) => {
    const image = e.target;
    image.style.cursor = 'zoom-in';
  };

  const handleThumbnailClick = (index) => {
    setImagenIndex(index);
    setIsImageLoading(true);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-[50] p-0 sm:p-4">
      <div className="bg-white w-full h-full sm:h-[90vh] sm:rounded-2xl max-w-5xl relative flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="fixed sm:absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white sm:bg-black/10 hover:bg-black/20 transition-colors"
        >
          <span className="text-black text-xl">&times;</span>
        </button>

        {loading && <LoadingScreen />}

        {/* Main content container - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Product Details Section */}
          <div className={`border-b border-gray-200 ${loading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto p-4">
              {/* Left column - Image */}
              <div className="pt-14 sm:pt-6">
                <div className="aspect-square relative bg-gray-50 rounded-xl overflow-hidden">
                  {/* Image navigation buttons */}
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

                  {/* Main image */}
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
                      onMouseEnter={handleMouseEnter}
                    />
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {modeloSeleccionado?.imagenes.map((imagen, index) => (
                    <div
                      key={index}
                      className={`w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${imagenIndex === index ? "border-black" : "border-transparent"}`}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <img
                        src={buildImageUrl(imagen.urlImagen)}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column - Product info */}
              <div className="flex flex-col h-full">
                <h2 className="text-xl sm:text-2xl font-medium mb-4">
                  {producto?.nombreProducto}
                </h2>

                {/* Price */}
                <div className="text-lg sm:text-xl font-semibold mb-4">
                  {producto?.tieneOferta ? (
                    <>
                      <span className="line-through text-gray-500 mr-2">
                        S/.{producto.precioOriginal}
                      </span>
                      <span className="text-red-600">
                        S/.{producto.precioDescuento}
                      </span>
                    </>
                  ) : (
                    <span>S/.{producto?.precioOriginal}</span>
                  )}
                </div>

                {modeloSeleccionado && (
                  <>
                    {/* Models selector */}
                    <div className="space-y-3 mb-6">
                      <h3 className="text-sm font-medium text-gray-500">Modelo</h3>
                      <div className="flex flex-wrap gap-2">
                        {producto?.modelos.map((modelo) => (
                          <button
                            key={modelo.nombreModelo}
                            onClick={() => handleModeloChange(modelo)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              modeloSeleccionado.nombreModelo === modelo.nombreModelo
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                          >
                            {modelo.nombreModelo}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sizes selector */}
                    <div className="space-y-3 mb-6">
                      <h3 className="text-sm font-medium text-gray-500">
                        {modeloSeleccionado.tallas.some(
                          (talla) => talla.nombreTalla === "Sin talla" || talla.nombreTalla === "Stock"
                        )
                          ? "Stock disponible"
                          : "Tallas disponibles"}
                      </h3>
                      {modeloSeleccionado.tallas.some(
                        (talla) => talla.nombreTalla === "Sin talla" || talla.nombreTalla === "Stock"
                      ) ? (
                        <div className="text-sm text-gray-800">
                          {
                            modeloSeleccionado.tallas.find(
                              (talla) => talla.nombreTalla === "Sin talla" || talla.nombreTalla === "Stock"
                            )?.cantidad
                          }{" "}
                          unidades disponibles
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {modeloSeleccionado.tallas.map((talla, index) => (
                            <label
                              key={index}
                              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                                tallaSeleccionada?.nombreTalla === talla.nombreTalla
                                  ? "bg-black text-white"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              <span className="font-medium text-sm">{talla.nombreTalla}</span>
                              <span className="text-xs opacity-75">{talla.cantidad} Unit.</span>
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
                      )}
                    </div>

                    {/* Quantity selector */}
                    <div className="space-y-3 mb-6">
                      <h3 className="text-sm font-medium text-gray-500">Cantidad</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleDecrease}
                          className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <AiOutlineMinus className="text-gray-600" />
                        </button>
                        <input
                          type="number"
                          value={cantidad}
                          onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 h-10 text-center border border-gray-200 rounded-lg"
                        />
                        <button
                          onClick={handleIncrease}
                          className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <AiOutlinePlus className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Characteristics Section */}
          {caracteristicas && (
            <div className="p-4 bg-gray-50">
              <div className="max-w-5xl mx-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Características del producto</h3>
                    {caracteristicas.length > 150 && (
                      <button
                        onClick={() => setIsCharacteristicsExpanded(!isCharacteristicsExpanded)}
                        className="text-sm font-medium text-black hover:text-gray-700 transition-colors flex items-center gap-1"
                      >
                        {isCharacteristicsExpanded ? "Ver menos" : "Ver más"}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 transform transition-transform ${
                            isCharacteristicsExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="bg-white rounded-xl p-6 relative overflow-hidden">
                    <div
                      className={`text-gray-600 whitespace-pre-wrap ${
                        !isCharacteristicsExpanded ? "max-h-32" : "max-h-none"
                      } transition-all duration-300 ease-in-out`}
                    >
                      {caracteristicas}
                    </div>
                    {caracteristicas.length > 150 && !isCharacteristicsExpanded && (
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
        </div>

        {/* Fixed bottom buttons */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <div className="max-w-5xl mx-auto flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className={`flex-1 bg-black text-white py-3 rounded-xl font-medium hover:bg-black/90 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Agregando..." : "Agregar al carrito"}
            </button>
            <button
              onClick={handleCompartir}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              <FaShareAlt className="text-lg" />
              <span className="hidden sm:inline">Compartir</span>
            </button>
          </div>
        </div>
      </div>

      {showModalLogin && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50">
          <CheckLogin setShowModal={handleCloseModalLogin} />
        </div>
      )}
    </div>
  );
}

export default DetalleProducto;