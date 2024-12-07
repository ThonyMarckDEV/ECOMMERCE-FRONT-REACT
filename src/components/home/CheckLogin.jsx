import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CheckLogin({ setShowModal }) {
  const navigate = useNavigate();

  // Verificar el token cuando el modal se muestra
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      setShowModal(true); // Muestra el modal si no hay token
    }
  }, [setShowModal]);

  const handleLoginRedirect = () => {
    navigate('/login');
    setShowModal(false); // Cierra el modal después de redirigir
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 shadow-lg animate-bounce">
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
    </div>
  );
}

export default CheckLogin;
