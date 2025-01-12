import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../js/urlHelper';
import DetalleProducto from './DetalleProducto';
import { AiOutlineLoading3Quarters, AiOutlineSearch, AiOutlineClose, AiOutlineFilter } from 'react-icons/ai';
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
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [currentSort, setCurrentSort] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const sortMenuRef = useRef(null);

  const categoriaURL = new URLSearchParams(location.search).get('categoria');

  const sortOptions = [
    { value: 'az', label: 'A-Z' },
    { value: 'za', label: 'Z-A' },
    { value: 'price_asc', label: 'Precio: Menor a Mayor' },
    { value: 'price_desc', label: 'Precio: Mayor a Menor' }
  ];

  // Obtener filtros activos de la URL
  const getActiveFilters = () => {
    const searchParams = new URLSearchParams(location.search);
    const activeFilters = [];

    if (searchParams.get('texto')) {
      activeFilters.push({ type: 'texto', value: searchParams.get('texto') });
    }
    if (searchParams.get('categoria')) {
      activeFilters.push({ type: 'categoria', value: searchParams.get('categoria') });
    }
    if (searchParams.get('precioInicial') || searchParams.get('precioFinal')) {
      activeFilters.push({
        type: 'precio',
        value: `S/.${searchParams.get('precioInicial') || 0} - S/.${searchParams.get('precioFinal') || '∞'}`,
      });
    }
    if (searchParams.get('sort')) {
      const sortLabel = sortOptions.find(opt => opt.value === searchParams.get('sort'))?.label;
      if (sortLabel) {
        activeFilters.push({ type: 'sort', value: sortLabel });
      }
    }

    return activeFilters;
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    navigate('/productos');
    setSearchTerm('');
    setCurrentSort('');
    setCurrentPage(1);
  };

  const ActiveFilters = () => {
    const activeFilters = getActiveFilters();
    
    if (activeFilters.length === 0) return null;

    return (
      <div className="w-full max-w-2xl mx-auto mb-4 px-4">
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700"
            >
              <span className="mr-2">
                {filter.type === 'texto' && 'Búsqueda: '}
                {filter.type === 'categoria' && 'Categoría: '}
                {filter.type === 'precio' && 'Precio: '}
                {filter.type === 'sort' && 'Ordenar: '}
                {filter.value}
              </span>
              <button
                onClick={() => removeFilter(filter.type)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <AiOutlineClose size={16} />
              </button>
            </div>
          ))}
          {activeFilters.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Limpiar todos
            </button>
          )}
        </div>
      </div>
    );
  };

  // Eliminar un filtro
  const removeFilter = (filterType) => {
    const searchParams = new URLSearchParams(location.search);
    
    // Eliminar el filtro específico
    if (filterType === 'precio') {
      searchParams.delete('precioInicial');
      searchParams.delete('precioFinal');
    } else {
      searchParams.delete(filterType);
    }
    
    // Mantener solo los filtros que no se están eliminando
    const remainingFilters = Object.fromEntries(searchParams);
    
    // Resetear la página
    searchParams.set('page', '1');
    
    // Limpiar estados internos
    if (filterType === 'texto') {
      setSearchTerm('');
    }
    if (filterType === 'sort') {
      setCurrentSort('');
    }
    if (filterType === 'categoria') {
      // Si hay otros estados relacionados con categoría, limpiarlos aquí
    }
    
    // Navegar con los filtros actualizados
    if (Object.keys(remainingFilters).length > 0) {
      navigate(`/productos?${searchParams.toString()}`);
    } else {
      navigate('/productos');
    }
    
    setCurrentPage(1);
  };

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }

    const sortParam = new URLSearchParams(location.search).get('sort');
    if (sortParam) {
      setCurrentSort(sortParam);
    }
  }, [location.search]);

  const saveSearch = (term) => {
    if (!term.trim()) return;
    const searches = recentSearches.filter(s => s !== term);
    const newSearches = [term, ...searches].slice(0, 5);
    setRecentSearches(newSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
  };

  const removeSearch = (searchToRemove) => {
    const newSearches = recentSearches.filter(search => search !== searchToRemove);
    setRecentSearches(newSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      saveSearch(searchTerm.trim());
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('texto', searchTerm);
      searchParams.set('page', '1');
      navigate(`/productos?${searchParams.toString()}`);
      setCurrentPage(1);
      setShowRecentSearches(false);
    }
  };

  const handleSort = (sortValue) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('sort', sortValue);
    searchParams.set('page', '1');
    navigate(`/productos?${searchParams.toString()}`);
    setCurrentSort(sortValue);
    setShowSortMenu(false);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('texto');
    searchParams.set('page', '1');
    navigate(`/productos?${searchParams.toString()}`);
    setCurrentPage(1);
    setShowRecentSearches(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target)) {
        setShowRecentSearches(false);
      }
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target)) {
        setShowSortMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
  
    // Verificar si la URL no tiene filtros
    const hasNoFilters = 
      !searchParams.has('texto') &&
      !searchParams.has('categoria') &&
      !searchParams.has('precioInicial') &&
      !searchParams.has('precioFinal') &&
      !searchParams.has('sort');
  
    if (hasNoFilters) {
      // Limpiar los estados internos relacionados con los filtros
      setSearchTerm('');
      setCurrentSort('');
    }
  
    // Resto del código para cargar productos...
    let isMounted = true;
    setLoading(true);
    setError(null);
  
    const filtroQuery = new URLSearchParams();
    if (filtro.texto) filtroQuery.append('texto', filtro.texto);
    if (filtro.categoria || categoriaURL) filtroQuery.append('categoria', filtro.categoria || categoriaURL);
    if (filtro.precioInicial !== undefined) filtroQuery.append('precioInicial', filtro.precioInicial);
    if (filtro.precioFinal !== undefined) filtroQuery.append('precioFinal', filtro.precioFinal);
    if (currentSort) filtroQuery.append('sort', currentSort);
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
  }, [filtro, categoriaURL, currentPage, currentSort, location.search]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', page);
    navigate(`/productos?${searchParams.toString()}`);
  };

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

  const activeFilters = getActiveFilters();

  return (
    <div className="bg-white min-h-screen p-4 flex flex-col items-center lg:items-start">
      <h1 className="text-4xl font-bold text-center my-6 text-black lg:text-left lg:pl-10 animate-fade-in">
        Productos
      </h1>

      {/* Barra de búsqueda y filtros */}
      <div className="w-full max-w-2xl mx-auto mb-8 px-4 relative z-10" ref={searchInputRef}>
          <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowRecentSearches(true)}
                className="w-full px-4 py-2 pr-28 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Buscar productos..."
              />
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center">
                {/* Botón de ordenamiento */}
                <div className="relative" ref={sortMenuRef}>
                  <button
                    type="button"
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <AiOutlineFilter size={20} />
                  </button>

                  {/* Menú de ordenamiento mejorado */}
                  {showSortMenu && (
                    <div className="fixed right-auto mt-2 w-56 bg-white border rounded-lg shadow-lg" style={{ zIndex: 9999 }}>
                      <div className="py-1">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleSort(option.value)}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-150
                              ${currentSort === option.value 
                                ? 'bg-blue-50 text-blue-600 font-medium' 
                                : 'text-gray-700'}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Botón de búsqueda */}
                <button
                  type="submit"
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <AiOutlineSearch size={20} />
                </button>

                {/* Botón para limpiar búsqueda */}
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <AiOutlineClose size={20} />
                  </button>
                )}
              </div>
          </form>
          
          {/* Mostrar búsquedas recientes cuando el input está enfocado */}
          {showRecentSearches && <RecentSearches />}
      </div>


      <ActiveFilters />

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