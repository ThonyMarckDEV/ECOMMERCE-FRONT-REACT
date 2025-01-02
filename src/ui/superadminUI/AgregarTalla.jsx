import React, { useState } from 'react';
import Sidebar from '../../components/superAdminComponents/SidebarSuperAdmin';
import API_BASE_URL from '../../js/urlHelper';
import SweetAlert from '../../components/SweetAlert';
import LoadingScreen from '../../components/home/LoadingScreen'; // Importar el componente de carga

function AgregarTalla() {
  const [nombreTalla, setNombreTalla] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt'); // Obtener el token JWT del localStorage

    if (!nombreTalla) {
      SweetAlert.showMessageAlert('Error', 'El nombre de la talla es obligatorio', 'error');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/agregarTalla`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ nombreTalla }),
      });

      if (response.ok) {
        SweetAlert.showMessageAlert('¡Éxito!', 'Talla agregada exitosamente', 'success');
        setNombreTalla('');
      } else {
        const errorData = await response.json();
        console.error('Error al agregar talla:', errorData);
        SweetAlert.showMessageAlert('Error', 'Hubo un error al agregar la talla', 'error');
      }
    } catch (error) {
      console.error('Error al agregar talla:', error);
      SweetAlert.showMessageAlert('Error', 'Hubo un error al agregar la talla', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Agregar Talla</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Nombre de la Talla (Requerido)</label>
              <input
                type="text"
                value={nombreTalla}
                onChange={(e) => setNombreTalla(e.target.value)}
                className="mt-1 block w-full py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            {loading ? (
              <div className="flex justify-center">
                <LoadingScreen /> {/* Mostrar el loader mientras se carga */}
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-700"
              >
                Agregar Talla
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AgregarTalla;