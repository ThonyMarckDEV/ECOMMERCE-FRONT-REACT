import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../js/urlHelper';
import DetalleProducto from './DetalleProducto';
import { AiOutlineLoading3Quarters, AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import ProductoCard from './ProductoCard';
import Pagination from './Pagination';

function ListarProductos({ filtro }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null); // Referencia para el input de búsqueda

  const categoriaURL = new URLSearchParams(location.search).get('categoria');

  // Cargar búsquedas recientes del localStorage al iniciar
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Guardar búsqueda en localStorage
  const saveSearch = (term) => {
    if (!term.trim()) return;
    
    const searches = recentSearches.filter(s => s !== term);
    const newSearches = [term, ...searches].slice(0, 5);
    
    setRecentSearches(newSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
  };

  // Eliminar búsqueda del historial
  const removeSearch = (searchToRemove) => {
    const newSearches = recentSearches.filter(search => search !== searchToRemove);
    setRecentSearches(newSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
  };

  // Manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      saveSearch(searchTerm.trim());
      // Actualizar filtro con el término de búsqueda
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('texto', searchTerm);
      searchParams.set('page', '1');
      navigate(`/productos?${searchParams.toString()}`);
      setCurrentPage(1);
      setShowRecentSearches(false);
    }
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('texto');
    searchParams.set('page', '1');
    navigate(`/productos?${searchParams.toString()}`);
    setCurrentPage(1);
    setShowRecentSearches(false);
  };

  // Ocultar sugerencias al hacer clic fuera del input
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target)) {
        setShowRecentSearches(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', page);
    navigate(`/productos?${searchParams.toString()}`);
  };

  // Componente de búsquedas recientes
  const RecentSearches = () => (
    <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded-md shadow-lg z-50">
      <div className="p-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Búsquedas recientes</h3>
        {recentSearches.length > 0 ? (
          <ul>
            {recentSearches.map((search, index) => (
              <li 
                key={index} 
                className="flex items-center justify-between py-1 px-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                <span 
                  className="text-gray-600"
                  onClick={() => {
                    setSearchTerm(search);
                    setShowRecentSearches(false);
                    const searchParams = new URLSearchParams(location.search);
                    searchParams.set('texto', search);
                    searchParams.set('page', '1');
                    navigate(`/productos?${searchParams.toString()}`);
                  }}
                >
                  {search}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSearch(search);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <AiOutlineClose size={16} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No hay búsquedas recientes</p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen absolute top-0 left-0 right-0 bottom-0 bg-white z-50">
        <div className="flex flex-col items-center">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl text-black" />
          <span className="ml-2 text-black text-lg">Cargando productos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 text-center mt-4">
        Error: {error}
      </p>
    );
  }

  return (
    <div className="bg-white min-h-screen p-4 flex flex-col items-center lg:items-start">
      <h1 className="text-4xl font-bold text-center my-6 text-black lg:text-left lg:pl-10 animate-fade-in">
        Productos
      </h1>

      {/* Barra de búsqueda */}
      <div className="w-full max-w-2xl mx-auto mb-8 px-4 relative" ref={searchInputRef}>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowRecentSearches(true)}
            className="w-full px-4 py-2 pr-20 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar productos..."
          />
          <button
            type="submit"
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <AiOutlineSearch size={20} />
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <AiOutlineClose size={20} />
            </button>
          )}
        </form>
        
        {/* Mostrar búsquedas recientes cuando el input está enfocado */}
        {showRecentSearches && <RecentSearches />}
      </div>

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