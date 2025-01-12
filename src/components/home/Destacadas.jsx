import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../js/urlHelper';

const Destacadas = () => {
  const [productos, setProductos] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const fetchProductosDestacados = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/productos-destacados?page=${currentPage}`);
      const data = await response.json();
      console.log("Respuesta de la API:", data); // Verifica la estructura de los datos
      if (data.success) {
        if (Array.isArray(data.data.data)) {
          setProductos(data.data);
        } else {
          console.error('La propiedad "data.data.data" no es un array:', data);
        }
      } else {
        console.error('Error en respuesta de la API:', data);
      }
    } catch (error) {
      console.error('Error fetching productos destacados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductosDestacados();
  }, [currentPage]);

  const handleProductoClick = (productoId) => {
    navigate(`/producto/${productoId}`);
  };

  // Calcular el total de páginas
  const totalPages = productos.last_page || 1;

  // Manejar el cambio de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Productos Destacados</h2>
        <div className="relative">
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-start bg-white opacity-75 mt-1">
              <div className="w-16 h-16 border-4 border-t-4 border-gray-600 border-solid rounded-full animate-spin"></div>
            </div>
          ) : null}

          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${loading ? 'opacity-0' : 'opacity-100'}`}>
            {productos.data?.map((producto) => {
              const imageUrl = producto.urlImagen 
                ? `${API_BASE_URL}/storage/${producto.urlImagen}` 
                : '/img/default-product.png';

              // Clave única basada en idProducto e idModelo
              const key = `${producto.idProducto}-${producto.idModelo}`;

              return (
                <div
                  key={key}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
                  onClick={() => handleProductoClick(producto.idProducto)}
                >
                  <img
                    src={imageUrl}
                    alt={producto.nombreProducto}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {producto.nombreProducto} - {producto.nombreModelo}
                    </h3>
                    <p className="text-gray-600">Ventas: {producto.totalVentas}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paginación */}
          <div className="flex justify-center mt-8 items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-1 px-4 py-2 rounded-full bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &larr; Anterior
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-4 py-2 rounded-full ${
                  currentPage === index + 1
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="mx-1 px-4 py-2 rounded-full bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Destacadas;