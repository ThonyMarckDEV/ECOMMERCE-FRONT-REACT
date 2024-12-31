import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import LoadingScreen from '../../components/home/LoadingScreen'; // Importar el componente de carga
import SweetAlert from '../../components/SweetAlert'; // Importar SweetAlert

const UsersTable = () => {
  const [userData, setUserData] = useState([]); // Datos de usuarios
  const [filteredData, setFilteredData] = useState([]); // Datos filtrados
  const [loading, setLoading] = useState(false); // Estado de carga
  const [pageCount, setPageCount] = useState(0); // Número total de páginas
  const [currentPage, setCurrentPage] = useState(0); // Página actual
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [filters, setFilters] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    status: '',
  }); // Filtros por columna

  const itemsPerPage = 5; // Elementos por página

  // Simular una API para obtener usuarios
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Simular una llamada a la API
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const data = await response.json();
      // Añadir un campo "status" a cada usuario
      const usersWithStatus = data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'Usuario', // Rol por defecto
        status: 'Activo', // Estado por defecto
      }));
      setUserData(usersWithStatus);
      setFilteredData(usersWithStatus);
      setPageCount(Math.ceil(usersWithStatus.length / itemsPerPage));
    } catch (error) {
      console.error('Error:', error);
      SweetAlert.showMessageAlert('Error', 'Hubo un problema al cargar los usuarios.', 'error'); // Mostrar SweetAlert de error
    } finally {
      setLoading(false);
    }
  };

  // Cambiar el estado de un usuario
  const toggleStatus = async (id) => {
    setLoading(true);
    try {
      // Simular una llamada a la API para cambiar el estado
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Nuevo Estado' }), // Simular cambio de estado
      });
      if (!response.ok) {
        throw new Error('Error al cambiar el estado');
      }
      // Actualizar el estado local
      setUserData((prevData) =>
        prevData.map((user) =>
          user.id === id ? { ...user, status: user.status === 'Activo' ? 'Inactivo' : 'Activo' } : user
        )
      );
      SweetAlert.showMessageAlert('¡Éxito!', 'El estado se actualizó correctamente.', 'success'); // Mostrar SweetAlert de éxito
    } catch (error) {
      console.error('Error:', error);
      SweetAlert.showMessageAlert('Error', 'Hubo un problema al actualizar el estado.', 'error'); // Mostrar SweetAlert de error
    } finally {
      setLoading(false);
    }
  };

  // Filtrar datos basados en el término de búsqueda y los filtros
  useEffect(() => {
    const filtered = userData.filter((user) => {
      return (
        user.id.toString().includes(filters.id) &&
        user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        user.role.toLowerCase().includes(filters.role.toLowerCase()) &&
        user.status.toLowerCase().includes(filters.status.toLowerCase()) &&
        (user.id.toString().includes(searchTerm) ||
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.status.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    setFilteredData(filtered);
    setPageCount(Math.ceil(filtered.length / itemsPerPage));
  }, [searchTerm, filters, userData]);

  // Obtener los datos paginados
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Manejar el cambio de página
  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (e, field) => {
    setFilters({
      ...filters,
      [field]: e.target.value,
    });
  };

  // Cargar los usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="overflow-auto">
      {/* Mostrar el loader si loading es true */}
      {loading && <LoadingScreen />}

      {/* Buscador general */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Tabla de usuarios */}
      <table className="w-full min-w-max table-auto border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">
              <input
                type="text"
                placeholder="Filtrar ID"
                value={filters.id}
                onChange={(e) => handleFilterChange(e, 'id')}
                className="w-full px-2 py-1 border rounded"
              />
            </th>
            <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">
              <input
                type="text"
                placeholder="Filtrar Nombre"
                value={filters.name}
                onChange={(e) => handleFilterChange(e, 'name')}
                className="w-full px-2 py-1 border rounded"
              />
            </th>
            <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">
              <input
                type="text"
                placeholder="Filtrar Correo"
                value={filters.email}
                onChange={(e) => handleFilterChange(e, 'email')}
                className="w-full px-2 py-1 border rounded"
              />
            </th>
            <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">
              <input
                type="text"
                placeholder="Filtrar Rol"
                value={filters.role}
                onChange={(e) => handleFilterChange(e, 'role')}
                className="w-full px-2 py-1 border rounded"
              />
            </th>
            <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">
              <input
                type="text"
                placeholder="Filtrar Estado"
                value={filters.status}
                onChange={(e) => handleFilterChange(e, 'status')}
                className="w-full px-2 py-1 border rounded"
              />
            </th>
            <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedData.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 text-sm text-gray-700 border-b">{user.id}</td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">{user.name}</td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">{user.email}</td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">{user.role}</td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                <span
                  className={`cursor-pointer px-2 py-1 rounded-full text-white ${
                    user.status === 'Activo' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  onClick={() => toggleStatus(user.id)}
                >
                  {user.status}
                </span>
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                <div className="space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => alert(`Editar usuario con ID: ${user.id}`)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    onClick={() => alert(`Actualizar usuario con ID: ${user.id}`)}
                  >
                    Actualizar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
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

export default UsersTable;