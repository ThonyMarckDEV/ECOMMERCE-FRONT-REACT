// ListarProductos.jsx
import React, { useEffect, useState, memo } from 'react';
import API_BASE_URL from '../../js/urlHelper';
import DetalleProducto from './DetalleProducto';
import LazyLoad from 'react-lazyload';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const ProductoCard = memo(({ producto, onClick }) => (
  <div
    className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow flex flex-col max-w-[280px] cursor-pointer"
    onClick={() => onClick(producto.idProducto)}
  >
    <div className="w-full h-48 mb-3 relative bg-gray-100 flex items-center justify-center">
      <LazyLoad
        height={192} // Altura en píxeles (48 * 4)
        offset={100}
        placeholder={
          <div className="w-full h-full bg-gray-200 animate-pulse rounded-md" />
        }
      >
        <img
          src={`${API_BASE_URL}/storage/${producto.imagen}`}
          alt={producto.nombreProducto}
          className="w-full h-full object-contain rounded-md"
          loading="lazy"
        />
      </LazyLoad>
    </div>

    <h2 className="text-sm font-bold mb-2 text-gray-900">{producto.nombreProducto}</h2>
    <p className="text-xs text-gray-600 mb-2">{producto.descripcion}</p>
    <p className="text-xs text-gray-500 mb-2">Categoría: {producto.nombreCategoria}</p>
    <p className="text-sm font-semibold text-gray-800">S/.{producto.precio}</p>
  </div>
));

function ListarProductos({ filtro }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    let isMounted = true; // Para evitar actualizaciones de estado en componentes desmontados
    setLoading(true);
    setError(null);

    // Construir la URL con los filtros
    const filtroQuery = new URLSearchParams();
    if (filtro.texto) filtroQuery.append('texto', filtro.texto);
    if (filtro.categoria) filtroQuery.append('categoria', filtro.categoria);
    if (filtro.precioInicial !== undefined) filtroQuery.append('precioInicial', filtro.precioInicial);
    if (filtro.precioFinal !== undefined) filtroQuery.append('precioFinal', filtro.precioFinal);

    // Fetch productos desde la API con filtros
    fetch(`${API_BASE_URL}/api/productos?${filtroQuery.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        return response.json();
      })
      .then((data) => {
        if (isMounted) {
          setProductos(data.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    // Cleanup function para evitar actualizaciones de estado en componentes desmontados
    return () => {
      isMounted = false;
    };
  }, [filtro]);

  const handleOpenModal = (idProducto) => {
    setProductoSeleccionado(idProducto);
  };

  const handleCloseModal = () => {
    setProductoSeleccionado(null);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-600" />
        <span className="ml-2 text-blue-600 text-lg">Cargando productos...</span>
      </div>
    );

  if (error)
    return (
      <p className="text-red-500 text-center mt-4">
        Error: {error}
      </p>
    );

  return (
    <div className="bg-white min-h-screen p-4">
      <h1 className="text-4xl font-bold text-center my-6 text-black lg:text-left lg:pl-10">
        Productos
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <ProductoCard
              key={producto.idProducto}
              producto={producto}
              onClick={handleOpenModal}
            />
          ))
        ) : (
          <p className="text-gray-700 col-span-full text-center">
            No se encontraron productos con los filtros aplicados.
          </p>
        )}
      </div>

      {productoSeleccionado && (
        <DetalleProducto
          productoId={productoSeleccionado}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default ListarProductos;
