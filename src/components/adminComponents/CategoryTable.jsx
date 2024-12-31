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

  const fetchCategorias = async (page = 0) => {
    const token = localStorage.getItem('jwt');
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/obtenerCategorias?page=${page + 1}&limit=${itemsPerPage}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener las categorías');
      }

      const data = await response.json();
      setCategorias(data.data || []);
      setPageCount(Math.ceil(data.total / itemsPerPage));
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias(currentPage);
  }, [currentPage]);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e, field) => {
    setFilters({
      ...filters,
      [field]: e.target.value
    });
  };

  const filteredCategorias = categorias.filter((categoria) => {
    return (
      categoria.idCategoria.toString().includes(filters.idCategoria) &&
      categoria.nombreCategoria.toLowerCase().includes(filters.nombreCategoria.toLowerCase()) &&
      (categoria.descripcion || '').toLowerCase().includes(filters.descripcion.toLowerCase()) &&
      categoria.estado.toLowerCase().includes(filters.estado.toLowerCase()) &&
      (
        categoria.idCategoria.toString().includes(searchTerm) ||
        categoria.nombreCategoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (categoria.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        categoria.estado.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  return (
    <div className="overflow-auto">
      {loading && <LoadingScreen />}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

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
          {filteredCategorias.map((categoria) => (
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
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => alert(`Eliminar categoría con ID: ${categoria.idCategoria}`)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={'Anterior'}
        nextLabel={'Siguiente'}
        breakLabel={'...'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'flex justify-center mt-6 space-x-2'}
        pageClassName={'px-3 py-1 border rounded-lg'}
        activeClassName={'bg-black text-white'}
        previousClassName={'px-3 py-1 border rounded-lg'}
        nextClassName={'px-3 py-1 border rounded-lg'}
        disabledClassName={'opacity-50 cursor-not-allowed'}
      />
    </div>
  );
};

export default CategoryTable;