import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../js/urlHelper';
import DetalleProducto from './DetalleProducto';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import ProductoCard from './ProductoCard'; // Asumimos que ProductoCard está exportado correctamente

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen absolute top-0 left-0 right-0 bottom-0 bg-white z-50">
        <div className="flex flex-col items-center">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl text-black" />
          <span className="ml-2 text-black text-lg">Cargando productos...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <p className="text-red-500 text-center mt-4">
        Error: {error}
      </p>
    );

  return (
    <div className="bg-white min-h-screen p-4 flex flex-col items-center lg:items-start">
      <h1 className="text-4xl font-bold text-center my-6 text-black lg:text-left lg:pl-10">
        Productos
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center lg:justify-items-start w-full">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <ProductoCard
              key={producto.idProducto}
              producto={producto}
              onClick={() => setProductoSeleccionado(producto.idProducto)}
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
          onClose={() => setProductoSeleccionado(null)}
        />
      )}
    </div>
  );
}

export default ListarProductos;