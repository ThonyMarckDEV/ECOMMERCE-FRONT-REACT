import React, { useState, useEffect } from 'react';
import SweetAlert from '../../components/SweetAlert';
import API_BASE_URL from '../../js/urlHelper';
import EditarProductoModal from '../../ui/superadminUI/ProductoEditarModal';
import ReactPaginate from 'react-paginate';
import LoadingScreen from '../../components/home/LoadingScreen';
import jwtUtils from '../../utilities/jwtUtils';
import { verificarYRenovarToken } from '../../js/authToken';

function ProductTable() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]); // Estado para almacenar las categorías
  const [loading, setLoading] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false); // Estado para la carga de categorías
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [editMode, setEditMode] = useState(null); // ID del producto en modo edición
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombreProducto: '',
    descripcion: '',
    precio: '',
    idCategoria: '',
    caracteristicas: '',
    estado: 'activo'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    nombreProducto: '',
    descripcion: '',
    estado: ''
  });
  const [changingEstado, setChangingEstado] = useState(false); // Estado para controlar el loader de toda la pantalla

  const itemsPerPage = 10; // Número de elementos por página

  useEffect(() => {
    cargarProductos(currentPage + 1); // ReactPaginate empieza en 0, la API en 1
    cargarCategorias(); // Cargar las categorías al montar el componente
  }, [currentPage, searchTerm, filters]);

  const cargarProductos = async (page) => {
    setLoading(true);
    await verificarYRenovarToken();
    try {
      const token = jwtUtils.getTokenFromCookie();
      const response = await fetch(`${API_BASE_URL}/api/listarProductos?page=${page}&search=${searchTerm}&filters=${JSON.stringify(filters)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Error al cargar productos');
      const data = await response.json();
      const formattedData = data.data.map(producto => ({
        ...producto,
        estado: producto.estado === true || producto.estado === 'activo' ? 'activo' : 'inactivo'
      }));
      setProductos(formattedData);
      setTotalPages(data.last_page);
    } catch (error) {
      SweetAlert.showMessageAlert('Error', 'Error al cargar productos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    setLoadingCategorias(true);
    await verificarYRenovarToken();
    try {
      const token = jwtUtils.getTokenFromCookie();
      const response = await fetch(`${API_BASE_URL}/api/categoriasproductos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Error al cargar categorías');
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      SweetAlert.showMessageAlert('Error', 'Error al cargar categorías', 'error');
    } finally {
      setLoadingCategorias(false);
    }
  };

  const toggleEstadoProducto = async (idProducto, estadoActual) => {
    setChangingEstado(true); // Activar el loader de toda la pantalla
    await verificarYRenovarToken();
    try {
      const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
      const token = jwtUtils.getTokenFromCookie();
      const response = await fetch(`${API_BASE_URL}/api/cambiarEstadoProducto/${idProducto}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          estado: nuevoEstado
        })
      });

      if (!response.ok) throw new Error('Error al cambiar estado');

      setProductos(productos.map(p =>
        p.idProducto === idProducto ? { ...p, estado: nuevoEstado } : p
      ));

      SweetAlert.showMessageAlert('Éxito', 'Estado actualizado correctamente', 'success');
    } catch (error) {
      SweetAlert.showMessageAlert('Error', 'No se pudo actualizar el estado', 'error');
    } finally {
      setChangingEstado(false); // Desactivar el loader de toda la pantalla
    }
  };

  const handleEditClick = (producto) => {
    setEditMode(producto.idProducto);
    setFormData({
      nombreProducto: producto.nombreProducto,
      descripcion: producto.descripcion,
      precio: producto.precio,
      idCategoria: producto.idCategoria || '', // Asegúrate de que idCategoria no sea undefined
      caracteristicas: producto.caracteristicas || '',
      estado: producto.estado
    });
  };

  const handleCancelEdit = () => {
    setEditMode(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProducto = async (idProducto) => {
    setLoading(true); // Activar el loader de toda la pantalla
    await verificarYRenovarToken();
    try {
      const token = jwtUtils.getTokenFromCookie();
      const response = await fetch(`${API_BASE_URL}/api/actualizarProducto/${idProducto}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al actualizar producto');

      SweetAlert.showMessageAlert('Éxito', 'Producto actualizado correctamente', 'success');
      setEditMode(null);
      cargarProductos(currentPage + 1); // Recargar la lista de productos
    } catch (error) {
      SweetAlert.showMessageAlert('Error', 'No se pudo actualizar el producto', 'error');
    } finally {
      setLoading(false); // Desactivar el loader de toda la pantalla
    }
  };

  const handleVerModelos = (producto) => {
    setSelectedProducto(producto); // Abrir modal con producto seleccionado
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleFilterChange = (e, filterName) => {
    const newFilters = { ...filters, [filterName]: e.target.value };
    setFilters(newFilters);
    setCurrentPage(0); // Reiniciar la página a 0 al aplicar nuevos filtros
  };

  return (
    <div>
      {/* Contenedor de la tabla con desplazamiento horizontal */}
      <div className="overflow-auto">
        {(loading || changingEstado) && <LoadingScreen />}

        <table className="w-full min-w-max table-auto border-collapse bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase border-b">
                <input
                  type="text"
                  placeholder="Filtrar Nombre"
                  value={filters.nombreProducto}
                  onChange={(e) => handleFilterChange(e, 'nombreProducto')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-400"
                />
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase border-b">
                <input
                  type="text"
                  placeholder="Filtrar Descripción"
                  value={filters.descripcion}
                  onChange={(e) => handleFilterChange(e, 'descripcion')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-400"
                />
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase border-b">
                Precio
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase border-b">
                Categoría
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase border-b">
                Características
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase border-b">
                Estado
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase border-b">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productos.map((producto) => (
              <tr key={producto.idProducto} className="hover:bg-gray-100">
                <td className="px-6 py-4 text-sm text-gray-700 border-b">
                  {editMode === producto.idProducto ? (
                    <input
                      type="text"
                      name="nombreProducto"
                      value={formData.nombreProducto}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-400"
                    />
                  ) : (
                    producto.nombreProducto
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 border-b">
                  {editMode === producto.idProducto ? (
                    <div>
                      <span className="text-xs text-gray-500 mb-1 block">
                        Máximo 60 caracteres
                      </span>
                      <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        maxLength={60}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                  ) : (
                    producto.descripcion
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 border-b">
                  {editMode === producto.idProducto ? (
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-400"
                    />
                  ) : (
                    `S/.${producto.precio}`
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 border-b">
                  {editMode === producto.idProducto ? (
                    <select
                      name="idCategoria"
                      value={formData.idCategoria}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-400"
                    >
                      <option value="">Seleccione una categoría</option>
                      {categorias.map((categoria) => (
                        <option key={categoria.idCategoria} value={categoria.idCategoria}>
                          {categoria.nombreCategoria}
                        </option>
                      ))}
                    </select>
                  ) : (
                    producto.categoria?.nombreCategoria || 'Sin categoría'
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 border-b min-w-[200px] max-w-[300px]">
                  {editMode === producto.idProducto ? (
                    <textarea
                      name="caracteristicas"
                      value={formData.caracteristicas}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-400"
                    />
                  ) : (
                    <div className="max-h-32 overflow-y-auto">
                      {producto.caracteristicas ? (
                        <ul className="space-y-1">
                          {producto.caracteristicas.split(',').map((caracteristica, index) => (
                            <li key={index} className="text-sm text-gray-700 border-b border-gray-100 py-1">
                              • {caracteristica.trim()}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500">Sin características</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 border-b">
                  <button
                    onClick={() => toggleEstadoProducto(producto.idProducto, producto.estado)}
                    className={`px-4 py-2 rounded-lg text-white font-semibold transition-all duration-200 ${
                      producto.estado === 'activo' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                    }`}
                    disabled={changingEstado}
                  >
                    {producto.estado}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 border-b">
                  <div className="flex items-center space-x-3">
                    {editMode === producto.idProducto ? (
                      <>
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                          onClick={() => handleUpdateProducto(producto.idProducto)}
                        >
                          Actualizar
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                          onClick={handleCancelEdit}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                          onClick={() => handleEditClick(producto)}
                        >
                          Editar
                        </button>
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                          onClick={() => handleVerModelos(producto)}
                        >
                          Ver Modelos
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <ReactPaginate
          previousLabel={'Anterior'}
          nextLabel={'Siguiente'}
          breakLabel={'...'}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'flex justify-center space-x-4'}
          pageClassName={'px-4 py-2 border rounded-lg'}
          activeClassName={'bg-gray-900 text-white'}
        />
      </div>

      {selectedProducto && (
        <EditarProductoModal
          producto={selectedProducto}
          onClose={() => setSelectedProducto(null)}
        />
      )}
    </div>
  );
}

export default ProductTable;