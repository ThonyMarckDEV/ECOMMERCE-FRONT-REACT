import React, { useEffect, useState } from 'react';
import LoadingScreen from '../../components/home/LoadingScreen';
import Notification from '../../components/home/Notificacion';
import { verificarYRenovarToken } from '../../js/authToken';
import API_BASE_URL from '../../js/urlHelper';

function Direcciones() {
  const [direcciones, setDirecciones] = useState([]);
  const [loading, setLoading] = useState(false); // Estado para controlar el loading
  const [notification, setNotification] = useState(null);
  const [userToken, setUserToken] = useState(localStorage.getItem('jwt'));

  useEffect(() => {
    if (userToken) {
      fetchDirecciones();
    } else {
      setNotification({
        description: 'No estás autenticado. Por favor, inicia sesión.',
        bgColor: 'bg-red-500',
      });
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
        setNotification({
          description: data.error || 'No se encontraron direcciones.',
          bgColor: 'bg-red-500',
        });
      }
    } catch (error) {
      setNotification({
        description: 'Error al obtener direcciones.',
        bgColor: 'bg-red-500',
      });
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
        setNotification({
          description: data.message || 'Dirección marcada como en uso.',
          bgColor: 'bg-green-500',
        });
  
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
        setNotification({
          description: data.error || 'Error al cambiar la dirección.',
          bgColor: 'bg-red-500',
        });
      }
    } catch (error) {
      setNotification({
        description: 'Error al actualizar la dirección.',
        bgColor: 'bg-red-500',
      });
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
        setNotification({
          description: data.message || 'Dirección eliminada exitosamente.',
          bgColor: 'bg-green-500',
        });

        // Optimizar: Eliminar localmente sin hacer un nuevo fetch
        setDirecciones(prevDirecciones =>
          prevDirecciones.filter(direccion => direccion.idDireccion !== idDireccion)
        );
      } else {
        setNotification({
          description: data.message || 'Error al eliminar la dirección.',
          bgColor: 'bg-red-500',
        });
      }
    } catch (error) {
      setNotification({
        description: 'Error al eliminar la dirección.',
        bgColor: 'bg-red-500',
      });
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
      
      {/* Mostrar notificación si existe */}
      {notification && <Notification description={notification.description} bgColor={notification.bgColor} />}
      
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-2xl font-semibold mb-4">Direcciones</h2>
          
          {direcciones.length > 0 ? (
            <div className="overflow-x-auto"> {/* Contenedor con desplazamiento horizontal */}
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2">Región</th>
                    <th className="px-4 py-2">Provincia</th>
                    <th className="px-4 py-2">Dirección</th>
                    <th className="px-4 py-2">Estado</th>
                    <th className="px-4 py-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {direcciones.map((direccion) => (
                    <tr key={direccion.idDireccion} className="border-b">
                      <td className="px-4 py-2">{direccion.region}</td>
                      <td className="px-4 py-2">{direccion.provincia}</td>
                      <td className="px-4 py-2">{direccion.direccion}</td>
                      <td className="px-4 py-2">{direccion.estado}</td>
                      <td className="px-4 py-2">
                        {direccion.estado === 'no usando' && (
                          <button
                            className="bg-black text-white px-4 py-2 rounded"
                            onClick={() => setDireccionUsando(direccion.idDireccion)}
                          >
                            Usar
                          </button>
                        )}
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded ml-2"
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
  );
}

export default Direcciones;
