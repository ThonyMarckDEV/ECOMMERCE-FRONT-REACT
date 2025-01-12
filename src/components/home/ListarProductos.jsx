// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import API_BASE_URL from '../../js/urlHelper';
// import DetalleProducto from './DetalleProducto';
// import { AiOutlineLoading3Quarters } from 'react-icons/ai';
// import ProductoCard from './ProductoCard';
// import Pagination from './Pagination'; // Asume que tienes un componente de paginación

// function ListarProductos({ filtro }) {
//   const [productos, setProductos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [productoSeleccionado, setProductoSeleccionado] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const location = useLocation();

//   const categoriaURL = new URLSearchParams(location.search).get('categoria');

//   useEffect(() => {
//     let isMounted = true;
//     setLoading(true);
//     setError(null);

//     const filtroQuery = new URLSearchParams();
//     if (filtro.texto) filtroQuery.append('texto', filtro.texto);
//     if (filtro.categoria || categoriaURL) filtroQuery.append('categoria', filtro.categoria || categoriaURL);
//     if (filtro.precioInicial !== undefined) filtroQuery.append('precioInicial', filtro.precioInicial);
//     if (filtro.precioFinal !== undefined) filtroQuery.append('precioFinal', filtro.precioFinal);
//     filtroQuery.append('page', currentPage); // Agregar la página actual a la consulta

//     fetch(`${API_BASE_URL}/api/productos?${filtroQuery.toString()}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Error al obtener los productos');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         if (isMounted) {
//           setProductos(data.data);
//           setTotalPages(data.last_page);
//           setLoading(false);
//         }
//       })
//       .catch((err) => {
//         if (isMounted) {
//           setError(err.message);
//           setLoading(false);
//         }
//       });

//     return () => {
//       isMounted = false;
//     };
//   }, [filtro, categoriaURL, currentPage]); // Agregar currentPage como dependencia

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen absolute top-0 left-0 right-0 bottom-0 bg-white z-50">
//         <div className="flex flex-col items-center">
//           <AiOutlineLoading3Quarters className="animate-spin text-4xl text-black" />
//           <span className="ml-2 text-black text-lg">Cargando productos...</span>
//         </div>
//       </div>
//     );

//   if (error)
//     return (
//       <p className="text-red-500 text-center mt-4">
//         Error: {error}
//       </p>
//     );

//   return (
//     <div className="bg-white min-h-screen p-4 flex flex-col items-center lg:items-start">
//       <h1 className="text-4xl font-bold text-center my-6 text-black lg:text-left lg:pl-10 animate-fade-in">
//         Productos
//       </h1>

//       {/* Contenedor de la cuadrícula de productos y paginación */}
//       <div className="w-full">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center lg:justify-items-start w-full animate-fade-in-down">
//           {productos.length > 0 ? (
//             productos.map((producto) => (
//               <ProductoCard
//                 key={producto.idProducto}
//                 producto={producto}
//                 onClick={() => setProductoSeleccionado(producto.idProducto)}
//                 className="animate-scale-up"
//               />
//             ))
//           ) : (
//             <p className="text-gray-700 col-span-full text-center animate-bounce-in">
//               No se encontraron productos con los filtros aplicados.
//             </p>
//           )}
//         </div>

//         {/* Paginación centrada debajo de los productos */}
//         <div className="w-full flex justify-center mt-6">
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       </div>

//       {productoSeleccionado && (
//         <DetalleProducto
//           productoId={productoSeleccionado}
//           onClose={() => setProductoSeleccionado(null)}
//           className="animate-flip-in"
//         />
//       )}
//     </div>
//   );
// }

// export default ListarProductos;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Importa useNavigate
import API_BASE_URL from '../../js/urlHelper';
import DetalleProducto from './DetalleProducto';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import ProductoCard from './ProductoCard';
import Pagination from './Pagination';

function ListarProductos({ filtro }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const navigate = useNavigate(); // Define navigate usando useNavigate

  const categoriaURL = new URLSearchParams(location.search).get('categoria');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const filtroQuery = new URLSearchParams();
    if (filtro.texto) filtroQuery.append('texto', filtro.texto);
    if (filtro.categoria || categoriaURL) filtroQuery.append('categoria', filtro.categoria || categoriaURL);
    if (filtro.precioInicial !== undefined) filtroQuery.append('precioInicial', filtro.precioInicial);
    if (filtro.precioFinal !== undefined) filtroQuery.append('precioFinal', filtro.precioFinal);
    filtroQuery.append('page', currentPage);

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
          setTotalPages(data.last_page);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [filtro, categoriaURL, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Actualizar la URL con la página actual
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', page);
    navigate(`/productos?${searchParams.toString()}`); // Usa navigate para actualizar la URL
  };

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
      <h1 className="text-4xl font-bold text-center my-6 text-black lg:text-left lg:pl-10 animate-fade-in">
        Productos
      </h1>

      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center lg:justify-items-start w-full animate-fade-in-down">
          {productos.length > 0 ? (
            productos.map((producto) => (
              <ProductoCard
                key={producto.idProducto}
                producto={producto}
                onClick={() => setProductoSeleccionado(producto.idProducto)}
                className="animate-scale-up"
              />
            ))
          ) : (
            <p className="text-gray-700 col-span-full text-center animate-bounce-in">
              No se encontraron productos con los filtros aplicados.
            </p>
          )}
        </div>

        <div className="w-full flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {productoSeleccionado && (
        <DetalleProducto
          productoId={productoSeleccionado}
          onClose={() => setProductoSeleccionado(null)}
          className="animate-flip-in"
        />
      )}
    </div>
  );
}

export default ListarProductos;