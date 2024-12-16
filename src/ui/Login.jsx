import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../js/urlHelper';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import LoadingScreen from '../components/home/LoadingScreen'; // Importa el componente LoadingScreen
import jwtUtils from '../utilities/jwtUtils'; // Asegúrate de importar el archivo correctamente
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // Cambiar a la nueva librería

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

  const handleGoogleSuccess = async (response) => {
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
  };

  return (
    <GoogleOAuthProvider clientId="265411714077-7as2ltld99egmkrtg7p25la9t6d2r4bb.apps.googleusercontent.com"> {/* Proveer tu Client ID */}
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 sm:p-10 rounded-lg w-full max-w-sm relative shadow-lg">
        {loading && <LoadingScreen />} {/* Mostrar la pantalla de carga si 'loading' es verdadero */}

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Iniciar sesión</h2>

        <form onSubmit={handleLogin}>
          {/* Input de correo */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Escribe tu correo"
              required
              className="w-full p-4 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Escribe tu contraseña"
                required
                autoComplete="new-password"
                className="w-full p-4 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16 appearance-none"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                {showPassword ? <AiFillEyeInvisible size={28} /> : <AiFillEye size={28} />}
              </button>
            </div>
          </div>

          {/* Botón de iniciar sesión */}
          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Mostrar error */}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}

        {/* Enlace a registro */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">¿Nuevo en ECOMMERCE? 
            <span 
              onClick={() => navigate('/register')}
              className="text-blue-600 cursor-pointer"
            >
              Regístrate aquí
            </span>
          </p>
        </div>

        {/* Botón de regresar */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            Regresar
          </button>
        </div>

        {/* Botón de login con Google */}
        <div className="mt-6 text-center">       
            <GoogleLogin
              onSuccess={handleGoogleSuccess}  {/* Aquí aseguramos que la referencia está correcta */}
              onError={() => setError('Error al intentar iniciar sesión con Google.')}
              useOneTap
              shape="pill" // Opcional, forma del botón
              text="signin_with" // Texto para el botón (opcional)
              theme="outline" // Estilo del botón
            />
        </div>
      </div>
    </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
