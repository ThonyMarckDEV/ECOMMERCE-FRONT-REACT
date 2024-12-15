import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API_BASE_URL from '../js/urlHelper';
import Notification from '../components/home/Notificacion'; // Importar el componente de notificación
import { logout } from '../js/logout'; // Cambiar a importación nombrada
import LoadingScreen from '../components/home/LoadingScreen'; // Importar la pantalla de carga
import verificarCorreo from '../img/verificar_correo.png'; // Imagen de correo no verificado

const VerificarCorreo = () => {
  const [notification, setNotification] = useState(null); // Estado para manejar notificaciones
  const [loading, setLoading] = useState(true); // Mostrar pantalla de carga inicialmente
  const [searchParams] = useSearchParams(); // Obtener parámetros de la URL
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Llamada a la API para verificar el token
      const verifyEmail = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/verificar-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          const result = await response.json();

          if (response.ok && result.success) {
            setNotification({
              message: 'Correo verificado exitosamente. Redirigiendo...',
              color: 'bg-green-400',
            });

            // Obtener nuevo token y redirigir
            const newTokenResponse = await fetch(`${API_BASE_URL}/api/refresh-token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${result.accessToken}`,
              },
            });

            const newTokenResult = await newTokenResponse.json();

            if (newTokenResponse.ok) {
              localStorage.setItem('jwt', newTokenResult.accessToken);
              setTimeout(() => navigate('/'), 3000);
            }
          } else {
            setNotification({
              message: result.message || 'Error verificando el correo.',
              color: 'bg-red-400',
            });
          }
        } catch (error) {
          console.error('Error verificando el token:', error);
          setNotification({
            message: 'Error al conectar con el servidor.',
            color: 'bg-red-400',
          });
        } finally {
          setLoading(false);
        }
      };

      verifyEmail();
    } else {
      setNotification({
        message: 'Token no proporcionado en la URL.',
        color: 'bg-red-400',
      });
      setLoading(false);
    }
  }, [searchParams, navigate]);

  const handleLogout = () => {
    logout(); // Cierra sesión
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen flex flex-col justify-between">
      {/* Navbar en la parte superior */}
      <div>
        <h2 className="text-center text-2xl font-bold p-4">Verificar Correo</h2>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col justify-center items-center text-center p-6">
        {loading ? (
          <LoadingScreen /> // Pantalla de carga mientras verifica el token
        ) : (
          <>
            {/* Imagen de correo no verificado */}
            <img
              src={verificarCorreo}
              alt="Correo no verificado"
              className="w-80 h-80 mb-6 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80"
            />

            {/* Notificación */}
            {notification && (
              <Notification description={notification.message} bgColor={notification.color} />
            )}

            {/* Botón de Cerrar sesión */}
            <button
              onClick={handleLogout}
              className="py-3 px-6 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none w-full sm:w-64 md:w-72"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerificarCorreo;
