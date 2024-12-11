import React, { useState, memo } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import API_BASE_URL from '../../js/urlHelper';

const ImageLoader = () => (
  <div className="absolute inset-0 flex justify-center items-center bg-gray-200 bg-opacity-50 rounded-md">
    <AiOutlineLoading3Quarters className="animate-spin text-3xl text-black" />
  </div>
);

const ProductoCard = memo(({ producto, onClick }) => {
  const [selectedModelo, setSelectedModelo] = useState(producto.modelos[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(
    selectedModelo.imagenes[0]?.urlImagen
      ? `${API_BASE_URL}/storage/${selectedModelo.imagenes[0]?.urlImagen}`
      : '/img/default-product.png'
  );

  const handleImageLoad = () => setIsLoading(false);
  const handleImageError = () => {
    setImgSrc('/img/default-product.png');
    setIsLoading(false);
  };

  const handleModeloChange = (modelo, e) => {
    e.stopPropagation(); // Evita activar el onClick de la tarjeta
    setSelectedModelo(modelo);
    setImgSrc(
      modelo.imagenes[0]?.urlImagen
        ? `${API_BASE_URL}/storage/${modelo.imagenes[0]?.urlImagen}`
        : '/img/default-product.png'
    );
    setIsLoading(true);
  };

  return (
    <div
      className="bg-white rounded-lg border-2 border-gray shadow-xl p-3 hover:shadow-2xl transition-shadow flex flex-col w-full cursor-pointer"
      onClick={() => onClick(producto.idProducto)}
    >
      <div className="w-full h-48 mb-3 relative bg-white flex items-center justify-center">
        {isLoading && <ImageLoader />}
        <img
          src={imgSrc}
          alt={selectedModelo.nombreModelo}
          className={`w-full h-full object-contain rounded-md ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>

      <h2 className="text-sm font-bold mb-2 text-gray-900">{producto.nombreProducto}</h2>
      <p className="text-xs text-gray-600 mb-2">{producto.descripcion}</p>
      <p className="text-xs text-gray-500 mb-2">Categoría: {producto.nombreCategoria}</p>
      <p className="text-sm font-semibold text-gray-800">S/.{producto.precio}</p>

      <div className="mt-3">
        <h3 className="text-sm font-semibold text-gray-700">Modelo: {selectedModelo.nombreModelo}</h3>
        <div className="flex gap-2 mt-2">
          {producto.modelos.map((modelo) => (
            <button
              key={modelo.nombreModelo}
              className={`px-2 py-1 text-xs border rounded-md ${
                selectedModelo.nombreModelo === modelo.nombreModelo ? 'bg-black text-white' : 'bg-gray-200'
              }`}
              onClick={(e) => handleModeloChange(modelo, e)}
            >
              {modelo.nombreModelo}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <h4 className="text-sm font-semibold text-gray-700">Tallas Disponibles:</h4>
        <ul className="list-disc pl-4 text-xs">
          {selectedModelo.tallas.map((talla) => (
            <li key={talla.nombreTalla}>
              {talla.nombreTalla} - {talla.cantidad} disponibles
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

// Exportación por defecto
export default ProductoCard;
