import React, { useState, useEffect, useCallback } from 'react';
import ReactPaginate from 'react-paginate';
import LoadingScreen from '../../components/home/LoadingScreen';
import SweetAlert from '../../components/SweetAlert';
import API_BASE_URL from '../../js/urlHelper';

const UsersTable = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    rol: '',
    estado: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [tempData, setTempData] = useState({});
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const itemsPerPage = 10;

  const fetchUsers = useCallback(async (filterParams = filters) => {
    setLoading(true);
    const token = localStorage.getItem('jwt');
    try {
      const params = new URLSearchParams({
        page: currentPage + 1,
        per_page: itemsPerPage,
        search: searchTerm,
        ...Object.fromEntries(
          Object.entries(filterParams).filter(([_, value]) => value !== '')
        ),
      });

      const response = await fetch(`${API_BASE_URL}/api/listarUsuariosAdmin?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al obtener los usuarios');

      const responseData = await response.json();
      if (!responseData.success) throw new Error('Formato de respuesta inválido');

      const usersWithStatus = responseData.usuarios.map(user => ({
        id: user.idUsuario?.toString() || '',
        nombres: user.nombres || '',
        apellidos: user.apellidos || '',
        email: user.correo || '',
        role: user.rol || '',
        status: user.estado?.toLowerCase() || 'activo',
      }));

      setUserData(usersWithStatus);
      setPageCount(responseData.pagination.last_page);
    } catch (error) {
      console.error('Error:', error);
      SweetAlert.showMessageAlert('Error', 'Hubo un problema al cargar los usuarios.', 'error');
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  }, [currentPage, searchTerm, filters]); // Added filters to dependencies

  useEffect(() => {
    if (!isFiltering) {
      fetchUsers();
    }
  }, [currentPage, fetchUsers, isFiltering]);

  const handleFilterChange = (e, field) => {
    const value = e.target.value;
    setIsFiltering(true);
    
    const newFilters = {
      ...filters,
      [field]: value,
    };
    
    setFilters(newFilters);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeoutId = setTimeout(() => {
      setCurrentPage(0);
      fetchUsers(newFilters);
    }, 100);

    setDebounceTimeout(timeoutId);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeoutId = setTimeout(() => {
      setCurrentPage(0);
      fetchUsers();
    }, 500);

    setDebounceTimeout(timeoutId);
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const toggleStatus = async (id) => {
    setLoading(true);
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`${API_BASE_URL}/api/listarUsuariosAdmin/${id}/cambiar-estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cambiar el estado');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error('Error en la respuesta del servidor');
      }

      await fetchUsers();
      SweetAlert.showMessageAlert('¡Éxito!', 'El estado se actualizó correctamente.', 'success');
    } catch (error) {
      console.error('Error:', error);
      SweetAlert.showMessageAlert('Error', 'Hubo un problema al actualizar el estado.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const editarUsuario = async (id, nuevosDatos) => {
    setLoading(true);
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`${API_BASE_URL}/api/listarUsuariosAdmin/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(nuevosDatos),
      });

      if (!response.ok) {
        throw new Error('Error al editar el usuario');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error('Error en la respuesta del servidor');
      }

      await fetchUsers();
      SweetAlert.showMessageAlert('¡Éxito!', 'Usuario editado correctamente.', 'success');
    } catch (error) {
      console.error('Error:', error);
      SweetAlert.showMessageAlert('Error', 'Hubo un problema al editar el usuario.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setTempData(user);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTempData({});
  };

  const handleUpdate = async (id) => {
    await editarUsuario(id, tempData);
    setEditingId(null);
    setTempData({});
  };

  const handleChange = (e, field) => {
    setTempData({
      ...tempData,
      [field]: e.target.value,
    });
  };

  const getRowKey = (user) => `user-row-${user.id}-${user.email}`;

  const getStatusColor = (status) => {
    return status?.toLowerCase() === 'activo'
      ? 'bg-green-500 hover:bg-green-600'
      : 'bg-red-500 hover:bg-red-600';
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        {loading && <LoadingScreen />}

        <table className="w-full min-w-max table-auto border-collapse bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase border-b">ID</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase border-b">
                <input
                  type="text"
                  placeholder="Filtrar Nombres"
                  value={filters.nombres}
                  onChange={(e) => handleFilterChange(e, 'nombres')}
                  className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase border-b">
                <input
                  type="text"
                  placeholder="Filtrar Apellidos"
                  value={filters.apellidos}
                  onChange={(e) => handleFilterChange(e, 'apellidos')}
                  className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase border-b">
                <input
                  type="text"
                  placeholder="Filtrar Correo"
                  value={filters.correo}
                  onChange={(e) => handleFilterChange(e, 'correo')}
                  className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase border-b">
                <input
                  type="text"
                  placeholder="Filtrar Rol"
                  value={filters.rol}
                  onChange={(e) => handleFilterChange(e, 'rol')}
                  className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase border-b">
                <input
                  type="text"
                  placeholder="Filtrar Estado"
                  value={filters.estado}
                  onChange={(e) => handleFilterChange(e, 'estado')}
                  className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase border-b">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {userData.map((user) => (
              <tr key={getRowKey(user)} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-700">{user.id}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editingId === user.id ? (
                    <input
                      type="text"
                      value={tempData.nombres}
                      onChange={(e) => handleChange(e, 'nombres')}
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    user.nombres
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editingId === user.id ? (
                    <input
                      type="text"
                      value={tempData.apellidos}
                      onChange={(e) => handleChange(e, 'apellidos')}
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    user.apellidos
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editingId === user.id ? (
                    <input
                      type="text"
                      value={tempData.email}
                      onChange={(e) => handleChange(e, 'email')}
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editingId === user.id ? (
                    <input
                      type="text"
                      value={tempData.role}
                      onChange={(e) => handleChange(e, 'role')}
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    user.role
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`cursor-pointer px-3 py-1 rounded-full text-white text-xs font-medium ${getStatusColor(user.status)} transition-colors`}
                    onClick={() => toggleStatus(user.id)}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {editingId === user.id ? (
                    <div className="flex space-x-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-600 transition-colors"
                        onClick={() => handleUpdate(user.id)}
                      >
                        Actualizar
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600 transition-colors"
                        onClick={handleCancel}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-600 transition-colors"
                      onClick={() => handleEdit(user)}
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

export default UsersTable;