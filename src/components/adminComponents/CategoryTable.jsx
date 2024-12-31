import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import API_BASE_URL from '../../js/urlHelper';
import LoadingScreen from '../../components/home/LoadingScreen';
import SweetAlert from '../../components/SweetAlert';

const CategoryTable = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    idCategoria: '',
    nombreCategoria: '',
    descripcion: '',
    estado: ''
  });

  const itemsPerPage = 5;

  // Obtener las categorías paginadas
  const fetchCategorias = async (page = 0) => {
    const token = localStorage.getItem('jwt');
    try {
      setLoading(true);

      // Construir la URL con los parámetros de filtro y búsqueda
      const url = new URL(`${API_BASE_URL}/api/obtenerCategorias`);
      url.searchParams.append('page', page + 1);
      url.searchParams.append('limit', itemsPerPage);
      url.searchParams.append('idCategoria', filters.idCategoria);
      url.searchParams.append('nombreCategoria', filters.nombreCategoria);
      url.searchParams.append('descripcion', filters.descripcion);
      url.searchParams.append('estado', filters.estado);
      url.searchParams.append('searchTerm', searchTerm);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las categorías');
      }

      const data = await response.json();
      setCategorias(data.data || []); // Actualizar los datos de la página actual
      setPageCount(data.totalPages); // Actualizar el total de páginas
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar las categorías cuando cambia la página, los filtros o el término de búsqueda
  useEffect(() => {
    fetchCategorias(currentPage);
  }, [currentPage, filters, searchTerm]);

  // Manejar el cambio de página
  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected); // Actualizar la página actual
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (e, field) => {
    setFilters({
      ...filters,
      [field]: e.target.value,
    });
  };

  // Cambiar el estado de una categoría
  const cambiarEstado = async (idCategoria, estadoActual) => {
    const token = localStorage.getItem('jwt');
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/cambiarEstadoCategoria/${idCategoria}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar el estado');
      }

      // Actualizar el estado local
      setCategorias((prevCategorias) =>
        prevCategorias.map((categoria) =>
          categoria.idCategoria === idCategoria
            ? { ...categoria, estado: nuevoEstado }
            : categoria
        )
      );

      SweetAlert.showMessageAlert('¡Éxito!', 'El estado se actualizó correctamente.', 'success');
    } catch (error) {
      console.error('Error:', error);
      SweetAlert.showMessageAlert('Error', 'Hubo un problema al actualizar el estado.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Contenedor del buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Contenedor de la tabla */}
      <div className="overflow-auto">
        {loading && <LoadingScreen />}

        <table className="w-full min-w-max table-auto border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">
                <input
                  type="text"
                  placeholder="Filtrar ID"
                  value={filters.idCategoria}
                  onChange={(e) => handleFilterChange(e, 'idCategoria')}
                  className="w-full px-2 py-1 border rounded"
                />
              </th>
              <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">
                <input
                  type="text"
                  placeholder="Filtrar Nombre"
                  value={filters.nombreCategoria}
                  onChange={(e) => handleFilterChange(e, 'nombreCategoria')}
                  className="w-full px-2 py-1 border rounded"
                />
              </th>
              <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">
                <input
                  type="text"
                  placeholder="Filtrar Descripción"
                  value={filters.descripcion}
                  onChange={(e) => handleFilterChange(e, 'descripcion')}
                  className="w-full px-2 py-1 border rounded"
                />
              </th>
              <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">Imagen</th>
              <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">
                <input
                  type="text"
                  placeholder="Filtrar Estado"
                  value={filters.estado}
                  onChange={(e) => handleFilterChange(e, 'estado')}
                  className="w-full px-2 py-1 border rounded"
                />
              </th>
              <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categorias.map((categoria) => (
              <tr key={categoria.idCategoria} className="hover:bg-gray-100">
                <td className="px-4 py-2 text-sm text-gray-700 border-b">{categoria.idCategoria}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b">{categoria.nombreCategoria}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b">{categoria.descripcion || 'N/A'}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b">
                  <img 
                    src={`${API_BASE_URL}/storage/${categoria.imagen}`}
                    alt={categoria.nombreCategoria} 
                    className="w-10 h-10 object-cover" 
                  />
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b">
                  <button
                    className={`inline-block px-3 py-1 rounded-full text-white font-bold ${
                      categoria.estado === 'activo' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    onClick={() => cambiarEstado(categoria.idCategoria, categoria.estado)}
                  >
                    {categoria.estado}
                  </button>
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b">
                  <div className="space-x-2">
                    <button
                      className="bg-black text-white px-3 py-1 rounded hover:bg-gray-700"
                      onClick={() => alert(`Editar categoría con ID: ${categoria.idCategoria}`)}
                    >
                      Editar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contenedor de la paginación */}
      <div className="mt-6">
        <ReactPaginate
          previousLabel={'Anterior'}
          nextLabel={'Siguiente'}
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'flex justify-center space-x-2'}
          pageClassName={'px-3 py-1 border rounded-lg'}
          activeClassName={'bg-black text-white'}
          previousClassName={'px-3 py-1 border rounded-lg'}
          nextClassName={'px-3 py-1 border rounded-lg'}
          disabledClassName={'opacity-50 cursor-not-allowed'}
        />
      </div>
    </div>
  );
};

export default CategoryTable;