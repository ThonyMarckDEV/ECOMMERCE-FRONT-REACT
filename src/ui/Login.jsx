import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../js/urlHelper';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import LoadingScreen from '../components/home/LoadingScreen'; // Importa el componente LoadingScreen
import jwtUtils from '../utilities/jwtUtils'; // Asegúrate de importar el archivo correctamente
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // Cambiar a la nueva librería
import { updateLastActivity } from '../js/lastActivity';

const Login = ({ closeLoginModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Mostrar la pantalla de carga

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: email,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('jwt', result.token);
        updateLastActivity();
        // Verificar si el correo ha sido verificado usando jwtUtils
        const emailVerified = jwtUtils.getEmailVerified(result.token);
        if (!emailVerified) {
          navigate('/verificar-correo'); // Redirigir al componente de verificación de correo
        } else {
          window.location.href = '/'; // Redirigir a la página principal
        }
      } else {
        setError(result.error || 'Hubo un error al iniciar sesión.');
      }
    } catch (error) {
      setError('Error en la conexión con el servidor.');
      console.error('Error al intentar iniciar sesión:', error);
    } finally {
      setLoading(false); // Ocultar la pantalla de carga después de completar la solicitud
    }
  };

  const handleGoogleLogin = async (response) => {
    if (response?.credential) {
      const tokenId = response.credential; // Usar `response.credential` en lugar de `tokenId`
      setLoading(true);

      try {
        const loginResponse = await fetch(`${API_BASE_URL}/api/login-google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            googleToken: tokenId, // Enviar el token para realizar login
          }),
        });

        const loginResult = await loginResponse.json();

        if (loginResponse.ok) {
          localStorage.setItem('jwt', loginResult.token); // Guardar el JWT en localStorage
          updateLastActivity();
          // Redirigir a la página principal después de iniciar sesión correctamente
          window.location.href = '/';
        } else {
          setError(loginResult.errors || 'Hubo un error al iniciar sesión con Google.');
        }
      } catch (error) {
        setError('Error al intentar iniciar sesión con Google.');
        console.error('Error al intentar iniciar sesión con Google:', error);
      } finally {
        setLoading(false); // Ocultar la pantalla de carga
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full max-w-md">
        {loading && <LoadingScreen />} {/* Pantalla de carga */}
  
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Bienvenido de nuevo
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Ingresa tus datos para continuar.
        </p>
  
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Campo de correo */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Campo de contraseña */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Escribe tu contraseña"
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
            </button>
          </div>
  
          {/* Botón de iniciar sesión */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
          >
            Iniciar sesión
          </button>
        </form>
  
        {/* Mostrar error */}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
  
        {/* Separador */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">O</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
  
        {/* Botón de login con Google */}
        <GoogleOAuthProvider clientId="265411714077-7as2ltld99egmkrtg7p25la9t6d2r4bb.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError('Error al intentar iniciar sesión con Google.')}
            useOneTap
            text="signin_with"
            theme="outline"
            shape="pill"
            className="w-full"
          />
        </GoogleOAuthProvider>
  
        {/* Enlace a registro */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            ¿Nuevo en ECOMMERCE?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-blue-600 cursor-pointer font-medium hover:underline"
            >
              Regístrate aquí
            </span>
          </p>
        </div>
  
        {/* Botón de regresar */}
        <div className="mt-6">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
