// Sidebar.jsx
import React from 'react';
import LogoutButton from './LogoutButton'; // Importamos el botón de logout
import { AiFillHome, AiFillSetting, AiOutlineLogout, AiOutlineFileText } from 'react-icons/ai'; // Iconos de react-icons

function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white p-6 h-full flex flex-col justify-between shadow-lg">
      <div>
        <h2 className="text-3xl font-bold mb-8 text-center text-green-500">Menú</h2>
        
        <ul>

          <li className="mb-4">
            <a href="/adminUI" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-lg transition-all duration-300">
              <AiFillHome className="mr-4 text-xl" /> {/* Icono de inicio */}
              <span>Inicio</span>
            </a>
          </li>

          {/* Opción nueva para Ver reportes */}
          <li className="mb-4">
            <a href="/reportes" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-lg transition-all duration-300">
              <AiOutlineFileText className="mr-4 text-xl" /> {/* Icono de reportes */}
              <span>Ver reportes</span>
            </a>
          </li>

          {/* Puedes agregar más opciones aquí */}
        </ul>

      </div>
      
      <div className="mt-auto">
        <LogoutButton /> {/* Botón de logout en el sidebar */}
      </div>
    </div>
  );
}

export default Sidebar;
