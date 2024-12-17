import React, { useState, useEffect } from 'react';
import LogoutButton from './LogoutButton';
import { AiFillHome, AiFillSetting, AiOutlineFileText, AiOutlineUser, AiOutlineDown, AiOutlineMenu } from 'react-icons/ai';

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openUsuarios, setOpenUsuarios] = useState(false);
  const [openTallas, setOpenTallas] = useState(false);
  const [openCategorias, setOpenCategorias] = useState(false);

  // Cierra la sidebar al hacer clic fuera
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
      {/* Botón de menú para dispositivos móviles */}
      <button
        className="menu-button fixed top-4 left-4 z-50 text-white bg-gray-900 p-2 rounded-lg focus:outline-none hover:bg-gray-700"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <AiOutlineMenu className="text-2xl" />
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar fixed top-0 left-0 h-full bg-gray-900 text-white shadow-lg p-6 w-64 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
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
                      <a href="/usuarios/editar" className="hover:text-green-400 transition-all duration-300">
                        Editar Usuarios
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              {/* Tallas */}
              <li className="mb-4">
                <div
                  className="flex items-center justify-between text-lg hover:bg-gray-700 p-2 rounded-lg cursor-pointer transition-all duration-300"
                  onClick={() => setOpenTallas(!openTallas)}
                >
                  <div className="flex items-center">
                    <AiOutlineFileText className="mr-4 text-xl" />
                    <span>Tallas</span>
                  </div>
                  <AiOutlineDown className={`transition-transform ${openTallas ? 'rotate-180' : ''}`} />
                </div>
                {openTallas && (
                  <ul className="ml-8 mt-2 space-y-2">
                    <li>
                      <a href="/tallas/agregar" className="hover:text-green-400 transition-all duration-300">
                        Agregar Tallas
                      </a>
                    </li>
                    <li>
                      <a href="/tallas/editar" className="hover:text-green-400 transition-all duration-300">
                        Editar Tallas
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              {/* Categorías */}
              <li className="mb-4">
                <div
                  className="flex items-center justify-between text-lg hover:bg-gray-700 p-2 rounded-lg cursor-pointer transition-all duration-300"
                  onClick={() => setOpenCategorias(!openCategorias)}
                >
                  <div className="flex items-center">
                    <AiFillSetting className="mr-4 text-xl" />
                    <span>Categorías</span>
                  </div>
                  <AiOutlineDown className={`transition-transform ${openCategorias ? 'rotate-180' : ''}`} />
                </div>
                {openCategorias && (
                  <ul className="ml-8 mt-2 space-y-2">
                    <li>
                      <a href="/categorias/agregar" className="hover:text-green-400 transition-all duration-300">
                        Agregar Categorías
                      </a>
                    </li>
                    <li>
                      <a href="/categorias/editar" className="hover:text-green-400 transition-all duration-300">
                        Editar Categorías
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
          <div className="mt-auto">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;