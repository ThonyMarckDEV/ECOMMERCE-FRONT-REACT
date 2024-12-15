import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBarHome from '../components/home/NavBarHome';
import { logout } from '../js/logout'; // Cambiar a importación nombrada
import verificarCorreo from '../img/verificar_correo.png'; // Asegúrate de que la ruta sea correcta

const VerificarCorreo = () => {

  // Llamamos al logout.js cuando el usuario hace click en "Cerrar sesión"
  const handleLogout = () => {
    logout(); // Cierra sesión
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen flex flex-col justify-center">
      {/* Navbar en la parte superior */}
      <NavBarHome />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col justify-center items-center text-center p-6">
        {/* Imagen de correo no verificado */}
        <img
          src={verificarCorreo}
          alt="Correo no verificado"
          className="w-80 h-80 mb-6"
        />

        {/* Título principal */}
        <h2 className="text-4xl font-bold mb-4">¡Verifica tu correo!</h2>

        {/* Mensaje adicional */}
        <p className="text-lg mb-4">Para poder usar tu cuenta, por favor verifica tu correo electrónico.</p>
        <p className="text-lg text-red-500 mb-6">Tu cuenta será eliminada en 10 minutos si no verificas el correo.</p>

        {/* Botón de Cerrar sesión */}
        <button
          onClick={handleLogout}
          className="py-3 px-6 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Pie de página o cualquier contenido adicional */}
    </div>
  );
};

export default VerificarCorreo;
