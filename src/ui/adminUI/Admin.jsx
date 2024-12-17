import React from 'react';
import '../../index.css';
import { logout } from '../../js/logout'; // Cambiar a importación nombrada

function Admin() {

  const handleLogout = () => {
      logout(); // Cierra sesión
    };

  return (
    <div className="bg-gray-200 font-sans min-h-screen overflow-hidden flex justify-center items-center">
      {/* Botón de cerrar sesión */}
      <button
        onClick={handleLogout} // Redirige al hacer clic
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default Admin;
