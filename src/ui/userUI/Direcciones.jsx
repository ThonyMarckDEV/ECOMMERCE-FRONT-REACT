import React, { useEffect, useState } from 'react';
import LoadingScreen from '../../components/home/LoadingScreen';
import { verificarYRenovarToken } from '../../js/authToken';
import API_BASE_URL from '../../js/urlHelper';
import SweetAlert from '../../components/SweetAlert';
import jwtUtils from '../../utilities/jwtUtils';

function Direcciones() {
  const [direcciones, setDirecciones] = useState([]);
  const [loading, setLoading] = useState(false); // Estado para controlar el loading
  const [userToken, setUserToken] = useState(jwtUtils.getTokenFromCookie());

  useEffect(() => {
    if (userToken) {
      fetchDirecciones();
    } else {
      SweetAlert.showMessageAlert('Error', 'No estás autenticado. Por favor, inicia sesión.', 'error'); 
    }
  }, [userToken]);

  const fetchDirecciones = async () => {
    setLoading(true); // Iniciar loader antes de la solicitud
    try {
      // Decodificar el token y obtener el idUsuario
      const decodedToken = JSON.parse(atob(userToken.split('.')[1]));
      const idUsuario = decodedToken.idUsuario;
  
      const response = await fetch(`${API_BASE_URL}/api/listarDireccion/${idUsuario}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        setDirecciones(data);
      } else {
        SweetAlert.showMessageAlert('Error', 'No se encontraron direcciones.', 'error'); 
      }
    } catch (error) {
      SweetAlert.showMessageAlert('Error', 'Error al obtener direcciones.', 'error'); 
    } finally {
      setLoading(false); // Detener loader cuando la solicitud termine
    }
  };
  

  const setDireccionUsando = async (idDireccion) => {
    setLoading(true); // Iniciar loader antes de la solicitud
    try {
      const response = await fetch(`${API_BASE_URL}/api/setDireccionUsando/${idDireccion}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        SweetAlert.showMessageAlert('Exito!', 'Dirección marcada como en uso.', 'success'); 

        // Optimizar: Actualizar localmente sin hacer un nuevo fetch
        setDirecciones(prevDirecciones =>
          prevDirecciones.map(direccion =>
            direccion.idDireccion === idDireccion
              ? { ...direccion, estado: 'usando' }
              : direccion
          )
        );
  
        // Llamar nuevamente a fetchDirecciones para actualizar las direcciones
        fetchDirecciones(); // Aseguramos que las direcciones estén actualizadas
      } else {
        SweetAlert.showMessageAlert('Error', 'Error al cambiar la dirección.', 'error'); 
      }
    } catch (error) {
      SweetAlert.showMessageAlert('Error', 'Error al actualizar la dirección.', 'error'); 
    } finally {
      setLoading(false); // Detener loader cuando la solicitud termine
    }
  };

  const eliminarDireccion = async (idDireccion) => {
    setLoading(true); // Iniciar loader antes de la solicitud
    try {
      const response = await fetch(`${API_BASE_URL}/api/eliminarDireccion/${idDireccion}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        SweetAlert.showMessageAlert('Exito!', 'Dirección eliminada exitosamente.', 'success');

        // Optimizar: Eliminar localmente sin hacer un nuevo fetch
        setDirecciones(prevDirecciones =>
          prevDirecciones.filter(direccion => direccion.idDireccion !== idDireccion)
        );
      } else {
        SweetAlert.showMessageAlert('Error', 'Error al eliminar la dirección.', 'error');
      }
    } catch (error) {
      SweetAlert.showMessageAlert('Error', 'Error al eliminar la dirección.', 'error');
    } finally {
      setLoading(false); // Detener loader cuando la solicitud termine
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800">
      {/* Mostrar el loader mientras se hace una solicitud */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <LoadingScreen />
        </div>
      )}
  
      {/* Contenedor principal que ocupa el espacio restante */}
      <div className="flex-1 container mx-auto p-4">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden h-full flex flex-col"> {/* Agregar shadow-xl */}
          {/* Encabezado */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800">Direcciones</h2>
          </div>
  
          {/* Contenido (flex-1 para ocupar el espacio restante) */}
          <div className="p-6 flex-1 overflow-y-auto">
            {direcciones.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm font-medium text-gray-500">
                      <th className="px-4 py-3">Departamento</th>
                      <th className="px-4 py-3">Distrito</th>
                      <th className="px-4 py-3">Provincia</th>
                      <th className="px-4 py-3">Dirección</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {direcciones.map((direccion) => (
                      <tr key={direccion.idDireccion} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-700">{direccion.departamento}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{direccion.distrito}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{direccion.provincia}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{direccion.direccion}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{direccion.estado}</td>
                        <td className="px-4 py-3 text-sm">
                          {direccion.estado === 'no usando' && (
                            <button
                              className="bg-black text-white px-3 py-1.5 rounded-md text-xs hover:bg-gray-700 transition-colors"
                              onClick={() => setDireccionUsando(direccion.idDireccion)}
                            >
                              Usar
                            </button>
                          )}
                          <button
                            className="bg-red-500 text-white px-3 py-1.5 rounded-md text-xs hover:bg-red-600 transition-colors ml-2"
                            onClick={() => eliminarDireccion(direccion.idDireccion)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">No tienes direcciones guardadas.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Direcciones;
