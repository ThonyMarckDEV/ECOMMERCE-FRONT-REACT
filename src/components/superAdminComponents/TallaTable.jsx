import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import API_BASE_URL from '../../js/urlHelper';
import LoadingScreen from '../../components/home/LoadingScreen';
import SweetAlert from '../../components/SweetAlert'; // Importar SweetAlert

const TallaTable = () => {
  const [tallas, setTallas] = useState([]); // Datos de tallas
  const [loading, setLoading] = useState(false); // Estado de carga
  const [pageCount, setPageCount] = useState(0); // Número total de páginas
  const [currentPage, setCurrentPage] = useState(0); // Página actual
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [filters, setFilters] = useState({
    idTalla: '',
    nombreTalla: '',
  }); // Filtros por columna
  const [editingId, setEditingId] = useState(null); // ID de la talla en edición
  const [editedNombreTalla, setEditedNombreTalla] = useState(''); // Nombre de la talla editado

  const itemsPerPage = 5; // Elementos por página

  // Obtener las tallas paginadas
  const fetchTallas = async (page = 0) => {
    const token = localStorage.getItem('jwt');
    try {
      setLoading(true);

      // Construir la URL con los parámetros de filtro y búsqueda
      const url = new URL(`${API_BASE_URL}/api/obtenerTallas`);
      url.searchParams.append('page', page + 1);
      url.searchParams.append('limit', itemsPerPage);
      url.searchParams.append('idTalla', filters.idTalla);
      url.searchParams.append('nombreTalla', filters.nombreTalla);
      url.searchParams.append('searchTerm', searchTerm);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las tallas');
      }

      const data = await response.json();
      setTallas(data.data || []); // Actualizar los datos de la página actual
      setPageCount(data.totalPages); // Actualizar el total de páginas
    } catch (error) {
      console.error('Error al obtener tallas:', error);
      setTallas([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar las tallas cuando cambia la página, los filtros o el término de búsqueda
  useEffect(() => {
    fetchTallas(currentPage);
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

  // Entrar en modo de edición
  const handleEdit = (talla) => {
    setEditingId(talla.idTalla);
    setEditedNombreTalla(talla.nombreTalla); // Inicializar el valor editable con el nombre actual
  };

  // Cancelar la edición
  const handleCancel = () => {
    setEditingId(null);
    setEditedNombreTalla('');
  };

  // Manejar cambios en el campo editable
  const handleEditChange = (e) => {
    setEditedNombreTalla(e.target.value);
  };

  // Actualizar la talla en la API
  const handleUpdate = async () => {
    const token = localStorage.getItem('jwt');
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/editarTalla/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ nombreTalla: editedNombreTalla }), // Solo se envía el nombreTalla
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la talla');
      }
      SweetAlert.showMessageAlert('¡Éxito!', 'La talla se ha actualizado correctamente.', 'success');
      // Actualizar la lista de tallas
      fetchTallas(currentPage);
      setEditingId(null);
      setEditedNombreTalla('');
    } catch (error) {
      SweetAlert.showMessageAlert('Error!', 'Hubo un error al actualizar la talla.', 'error');
      console.error('Error al actualizar talla:', error);
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
                  value={filters.idTalla}
                  onChange={(e) => handleFilterChange(e, 'idTalla')}
                  className="w-full px-2 py-1 border rounded"
                />
              </th>
              <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">
                <input
                  type="text"
                  placeholder="Filtrar Nombre"
                  value={filters.nombreTalla}
                  onChange={(e) => handleFilterChange(e, 'nombreTalla')}
                  className="w-full px-2 py-1 border rounded"
                />
              </th>
              <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tallas.map((talla) => (
              <tr key={talla.idTalla} className="hover:bg-gray-100">
                <td className="px-4 py-2 text-sm text-gray-700 border-b">
                  {talla.idTalla} {/* El ID no es editable */}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b">
                  {editingId === talla.idTalla ? (
                    <input
                      type="text"
                      value={editedNombreTalla}
                      onChange={handleEditChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    talla.nombreTalla
                  )}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b">
                  <div className="space-x-2">
                    {editingId === talla.idTalla ? (
                      <>
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          onClick={handleUpdate}
                        >
                          Actualizar
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          onClick={handleCancel}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleEdit(talla)}
                      >
                        Editar
                      </button>
                    )}
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

export default TallaTable;