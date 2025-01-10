import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API_BASE_URL from '../js/urlHelper';
import Notification from '../components/home/Notificacion';
import LoadingScreen from '../components/home/LoadingScreen';
import verificarCorreo from '../img/verificar_correo.png';
import jwtUtils from '../utilities/jwtUtils';

const VerificarCorreo = () => {
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAndRefreshToken = async () => {
      const token_veririficador = searchParams.get('token_veririficador');
      const token = jwtUtils.getTokenFromCookie();

      if (token_veririficador) {
        try {
          // Verificar el token de la URL
          const verifyResponse = await fetch(`${API_BASE_URL}/api/verificar-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : '', // Enviar el token si está presente
            },
            body: JSON.stringify({ token_veririficador }),
          });

          const verifyResult = await verifyResponse.json();

          if (verifyResponse.ok && verifyResult.success) {
            setNotification({
              message: 'Correo verificado exitosamente. Redirigiendo...',
              color: 'bg-green-400',
            });

            // Guardar el nuevo token en localStorage si el usuario está autenticado
            if (verifyResult.token) {
              localStorage.setItem('jwt', verifyResult.token);
            }

            // Redirigir después de un pequeño retraso
            setTimeout(() => navigate('/'), 3000);
          } else {
            setNotification({
              message: verifyResult.message || 'Error verificando el correo.',
              color: 'bg-red-400',
            });
          }
        } catch (error) {
          console.error('Error al verificar el correo:', error);
          setNotification({
            message: 'Error al comunicarse con el servidor.',
            color: 'bg-red-400',
          });
        }
      } else {
        setNotification({
          message: 'Token no proporcionado en la URL.',
          color: 'bg-red-400',
        });
      }

      setLoading(false);
    };

    verifyAndRefreshToken();
  }, [searchParams, navigate]);

  return (
    <div className="bg-white text-gray-800 min-h-screen flex flex-col justify-between">
      <div>
        <h2 className="text-center text-2xl font-bold p-4">Verificar Correo</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center p-6">
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <img
              src={verificarCorreo}
              alt="Correo no verificado"
              className="w-80 h-80 mb-6 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80"
            />
            {notification && (
              <Notification description={notification.message} bgColor={notification.color} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VerificarCorreo;
