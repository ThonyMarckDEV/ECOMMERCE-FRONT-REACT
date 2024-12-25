// AdminUI.jsx
import React from 'react';
import Sidebar from '../../components/adminComponents/Sidebar';  // Importamos el sidebar

function AgregarUsuario() {
  return (
    <div className="flex h-screen"> {/* Asegura que el contenedor principal ocupe toda la altura */}
      <Sidebar />  {/* Llamamos al Sidebar */}
      <div className="flex-1 p-8 bg-gray-100"> {/* El contenido principal ocupa el espacio restante */}
      
      </div>
    </div>
  );
}

export default AgregarUsuario;
