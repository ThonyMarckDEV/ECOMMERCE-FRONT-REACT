import React, { useState } from 'react';
import Sidebar from '../../components/superAdminComponents/SidebarSuperAdmin'; // Importamos el Sidebar
import API_BASE_URL from '../../js/urlHelper';
import SweetAlert from '../../components/SweetAlert';
import LoaderScreen from '../../components/home/LoadingScreen'; // Importar tu componente LoaderScreen
import jwtUtils from '../../utilities/jwtUtils';

function AgregarUsuario() {
  const [rol, setRol] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = jwtUtils.getTokenFromCookie();

    if ( !nombres || !apellidos || !correo || !password) {
      SweetAlert.showMessageAlert('Error', 'Todos los campos son obligatorios.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('rol', rol);
    formData.append('nombres', nombres);
    formData.append('apellidos', apellidos);
    formData.append('correo', correo);
    formData.append('password', password);

    try {
      setLoading(true); // Activar el loader

      // Configurar la solicitud HTTP con el token JWT en el encabezado
      const response = await fetch(`${API_BASE_URL}/api/adminAgregar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData, // FormData incluye los datos del formulario
      });

      if (response.ok) {
        SweetAlert.showMessageAlert('Éxito', 'Usuario agregado exitosamente', 'success');
        setNombres('');
        setApellidos('');
        setCorreo('');
        setPassword('');
        e.target.reset(); // Resetea el formulario
      } else {
        const errorData = await response.json();
        console.error('Error al agregar usuario:', errorData);
        SweetAlert.showMessageAlert('Error', 'Hubo un error al agregar el usuario', 'error');
      }
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      SweetAlert.showMessageAlert('Error', 'Hubo un error al agregar el usuario', 'error');
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
          <h2 className="text-2xl font-semibold mb-6">Agregar Admin</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Nombres (Requerido)</label>
              <input
                type="text"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                className="mt-1 block w-full py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Apellidos (Requerido)</label>
              <input
                type="text"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                className="mt-1 block w-full py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Correo (Requerido)</label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="mt-1 block w-full py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Contraseña (Requerido)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full py-3 px-4 bg-gray-900 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Agregar Usuario'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AgregarUsuario;