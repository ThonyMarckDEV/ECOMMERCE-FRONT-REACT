import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../js/urlHelper';

const Login = ({ closeLoginModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Inicializamos useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Resetear el error antes de hacer la solicitud

    try {
      // Realizar la solicitud a la API para iniciar sesión
      const response = await fetch(`${API_BASE_URL}/api/login`, { // Asegúrate de que la URL corresponda a tu API
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
        // Si la autenticación fue exitosa, guardamos el token en localStorage
        localStorage.setItem('jwt', result.token);
        
        // Redirigir a la página principal
        navigate('/');
      } else {
        // Mostrar error si las credenciales son incorrectas o hubo algún problema
        setError(result.error || 'Hubo un error al iniciar sesión.');
      }
    } catch (error) {
      setError('Error en la conexión con el servidor.');
      console.error('Error al intentar iniciar sesión:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 sm:p-10 rounded-lg w-full max-w-sm relative shadow-lg transform transition-all">
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

          {/* Input de contraseña */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Escribe tu contraseña"
              required
              className="w-full p-4 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botón de iniciar sesión */}
          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
              onClick={() => navigate('/register')} // Redirigir a la página de registro
              className="text-blue-600 cursor-pointer"
            >
              Regístrate aquí
            </span>
          </p>
        </div>

        {/* Botón de regresar */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')} // Redirige a la página principal
            className="w-full py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            Regresar
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;
