import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../js/urlHelper';
import DetalleProducto from './DetalleProducto';

function ListarProductos({ filtro }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    // Construir la URL con los filtros
    const filtroQuery = new URLSearchParams();
    if (filtro.texto) filtroQuery.append('texto', filtro.texto);
    if (filtro.categoria) filtroQuery.append('categoria', filtro.categoria);

    // Fetch productos desde la API con filtros
    fetch(`${API_BASE_URL}/api/productos?${filtroQuery.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        return response.json();
      })
      .then((data) => {
        setProductos(data.data); // Asegúrate de acceder a la propiedad "data" del JSON devuelto
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [filtro]); // Re-fetch productos cada vez que el filtro cambie

  const handleOpenModal = (idProducto) => {
    setProductoSeleccionado(idProducto);
  };

  const handleCloseModal = () => {
    setProductoSeleccionado(null);
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-white min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center my-6 text-black">Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productos.map((producto) => (
          <div
            key={producto.idProducto}
            className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow flex flex-col max-w-[280px]" // Establecer un ancho máximo para las tarjetas
            onClick={() => handleOpenModal(producto.idProducto)} // Abre el modal al hacer clic
          >
            <div className="w-full h-48 mb-3 relative bg-gray-100">  {/* Fondo gris oscuro */}
              <img
                src={`${API_BASE_URL}/storage/${producto.imagen}`}
                alt={producto.nombreProducto}
                className="w-full h-full object-contain rounded-md" // Asegurar que la imagen se ajuste sin recortarse
              />
            </div>

            <h2 className="text-sm font-bold mb-2 text-gray-900">{producto.nombreProducto}</h2>
            <p className="text-xs text-gray-600 mb-2">{producto.descripcion}</p>
            <p className="text-xs text-gray-500 mb-2">Categoría: {producto.nombreCategoria}</p>
            <p className="text-sm font-semibold text-gray-800">${producto.precio}</p>
          </div>
        ))}
      </div>

      {productoSeleccionado && (
        <DetalleProducto
          productoId={productoSeleccionado}
          onClose={handleCloseModal} // Pasar el método para cerrar el modal
        />
      )}
    </div>
  );
}

export default ListarProductos;
