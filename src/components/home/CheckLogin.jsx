// CheckLogin.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function CheckLogin({ setShowModal }) {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
    setShowModal(false); // Cierra el modal después de redirigir
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow-lg animate-bounce relative">
      {/* Botón de cerrar */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-2 right-2 text-gray-500 text-2xl hover:text-gray-700"
      >
        &times;
      </button>

      <h2 className="text-xl font-semibold text-gray-800">¡Inicia sesión!</h2>
      <p className="text-gray-600 mt-2">Debes iniciar sesión antes de realizar esta acción.</p>
      <div className="mt-4 flex justify-between">
        <button 
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-all"
          onClick={() => setShowModal(false)}
        >
          Cerrar
        </button>
        <button 
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 transition-all"
          onClick={handleLoginRedirect}
        >
          Ir a Login
        </button>
      </div>
    </div>
  );
}

export default CheckLogin;
