import React, { useState, useEffect } from 'react';
import LogoutButton from './LogoutButton';
import { AiFillHome, AiFillSetting, AiOutlineFileText, AiOutlineUser, AiOutlineDown, AiOutlineMenu } from 'react-icons/ai';

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openUsuarios, setOpenUsuarios] = useState(false);
  const [openTallas, setOpenTallas] = useState(false);
  const [openCategorias, setOpenCategorias] = useState(false);

  // Cierra la sidebar al hacer clic fuera (solo en móviles)
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isSidebarOpen && !e.target.closest('.sidebar') && !e.target.closest('.menu-button')) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isSidebarOpen]);

  return (
    <div>
      {/* Botón de menú solo visible en dispositivos móviles */}
      <button
        className="menu-button lg:hidden fixed top-4 left-4 z-50 text-white bg-gray-900 p-2 rounded-lg focus:outline-none hover:bg-gray-700"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <AiOutlineMenu className="text-2xl" />
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar fixed lg:relative top-0 left-0 h-full bg-gray-900 text-white shadow-lg p-6 w-64 transform lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:block transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center text-green-500">Menú</h2>
            <ul>
              {/* Dashboard */}
              <li className="mb-4">
                <a href="/dashboard" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-lg transition-all duration-300">
                  <AiFillHome className="mr-4 text-xl" />
                  <span>Dashboard</span>
                </a>
              </li>

              {/* Usuarios */}
              <li className="mb-4">
                <div
                  className="flex items-center justify-between text-lg hover:bg-gray-700 p-2 rounded-lg cursor-pointer transition-all duration-300"
                  onClick={() => setOpenUsuarios(!openUsuarios)}
                >
                  <div className="flex items-center">
                    <AiOutlineUser className="mr-4 text-xl" />
                    <span>Usuarios</span>
                  </div>
                  <AiOutlineDown className={`transition-transform ${openUsuarios ? 'rotate-180' : ''}`} />
                </div>
                {openUsuarios && (
                  <ul className="ml-8 mt-2 space-y-2">
                    <li>
                      <a href="/usuarios/agregar" className="hover:text-green-400 transition-all duration-300">
                        Agregar Usuarios
                      </a>
                    </li>
                    <li>
                      <a href="/admin/usuarios/editar" className="hover:text-green-400 transition-all duration-300">
                        Editar Usuarios
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              {/* Reportes */}
              <li className="mb-4">
                <a href="/reportes" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-lg transition-all duration-300">
                  <AiOutlineFileText className="mr-4 text-xl" />
                  <span>Reportes</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;