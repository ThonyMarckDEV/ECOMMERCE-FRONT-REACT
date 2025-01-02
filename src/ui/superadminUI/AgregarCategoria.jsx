import React, { useState } from 'react';
import Sidebar from '../../components/superAdminComponents/SidebarSuperAdmin'; // Importamos el Sidebar
import API_BASE_URL from '../../js/urlHelper';
import SweetAlert from '../../components/SweetAlert';
import LoaderScreen from '../../components/home/LoadingScreen'; // Importar tu componente LoaderScreen

function AgregarCategoria() {
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImagenChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt'); // Obtener el token JWT del localStorage

    if (!nombreCategoria || !imagen) {
      SweetAlert.showMessageAlert('Error', 'El nombre de la categoría y la imagen son obligatorios.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('nombreCategoria', nombreCategoria);
    formData.append('descripcion', descripcion);
    formData.append('imagen', imagen);

    try {
      setLoading(true); // Activar el loader

      // Configurar la solicitud HTTP con el token JWT en el encabezado
      const response = await fetch(`${API_BASE_URL}/api/categorias`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData, // FormData incluye los datos del formulario, incluido el archivo
      });

      if (response.ok) {
        SweetAlert.showMessageAlert('Éxito', 'Categoría agregada exitosamente', 'success');
        setNombreCategoria('');
        setDescripcion('');
        setImagen(null); // Limpiar el campo de imagen
        e.target.reset(); // Resetea el formulario, incluyendo el campo de imagen
      } else {
        const errorData = await response.json();
        console.error('Error al agregar categoría:', errorData);
        SweetAlert.showMessageAlert('Error', 'Hubo un error al agregar la categoría', 'error');
      }
    } catch (error) {
      console.error('Error al agregar categoría:', error);
      SweetAlert.showMessageAlert('Error', 'Hubo un error al agregar la categoría', 'error');
    } finally {
      setLoading(false); // Desactivar el loader
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        {/* Mostrar el LoaderScreen si loading es true */}
        {loading && <LoaderScreen />}
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Agregar Categoría</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Nombre de la Categoría (Requerido)</label>
              <input
                type="text"
                value={nombreCategoria}
                onChange={(e) => setNombreCategoria(e.target.value)}
                className="mt-1 block w-full py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Descripción (opcional)</label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="mt-1 block w-full py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Imagen (Requerido)</label>
              <input
                type="file"
                onChange={handleImagenChange}
                className="w-full cursor-pointer rounded-md border border-stroke dark:border-dark-3 text-dark-6 outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke dark:file:border-dark-3 file:bg-gray-2 dark:file:bg-dark-2 file:py-3 file:px-5 file:text-body-color dark:file:text-dark-6 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
              />
            </div>
            <button
              type="submit"
              className={`w-full py-3 px-4 bg-gray-900 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Agregar Categoría'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AgregarCategoria;