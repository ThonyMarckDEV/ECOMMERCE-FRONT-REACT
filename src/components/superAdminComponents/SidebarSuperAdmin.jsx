import React, { useState, useEffect } from 'react';
import LogoutButton from './LogoutButton';
import {
  AiFillHome,
  AiFillSetting,
  AiOutlineFileText,
  AiOutlineUser,
  AiOutlineDown,
  AiOutlineMenu,
  AiOutlineProduct,
  AiOutlineMenuFold,
  AiOutlineClose,
} from 'react-icons/ai';

function SidebarSuperAdmin() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    usuarios: false,
    tallas: false,
    categorias: false,
    productos: false,
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.sidebar-container') && !e.target.closest('.hamburger-button')) {
        setIsExpanded(false);
        setIsManuallyExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const toggleSidebar = () => {
    setIsManuallyExpanded(!isManuallyExpanded);
    setIsExpanded(!isManuallyExpanded);
  };

  const handleMouseEnter = () => {
    if (!isManuallyExpanded) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isManuallyExpanded) {
      setIsExpanded(false);
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="hamburger-button fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-all duration-300"
        onClick={toggleSidebar}
        aria-label="Toggle Menu"
      >
        {isManuallyExpanded ? (
          <AiOutlineClose className="text-2xl" />
        ) : (
          <AiOutlineMenu className="text-2xl" />
        )}
      </button>

      <div 
        className="sidebar-container fixed left-0 top-0 h-full z-40"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Franja cuando está colapsado */}
        <div className={`absolute left-0 top-0 h-full w-2 bg-gray-900 transition-all duration-300 ${isExpanded || isManuallyExpanded ? 'opacity-0' : 'opacity-100'}`} />

        {/* Sidebar principal */}
        <div className={`
          sidebar bg-gray-900 text-white h-full overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded || isManuallyExpanded ? 'w-64' : 'w-2'}
        `}>
          <div className="flex flex-col h-full p-6">
            <div className={`transition-opacity duration-300 ${isExpanded || isManuallyExpanded ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-3xl font-bold mb-8 text-center">Menú</h2>
              <ul>
                {/* Dashboard */}
                <li className="mb-4">
                  <a href="/dashboard" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-lg">
                    <AiFillHome className="mr-4 text-xl" />
                    <span>Dashboard</span>
                  </a>
                </li>

                {/* Usuarios */}
                <li className="mb-4">
                  <div
                    className="flex items-center justify-between text-lg hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
                    onClick={() => toggleMenu('usuarios')}
                  >
                    <div className="flex items-center">
                      <AiOutlineUser className="mr-4 text-xl" />
                      <span>Usuarios</span>
                    </div>
                    <AiOutlineDown className={`transition-transform ${openMenus.usuarios ? 'rotate-180' : ''}`} />
                  </div>
                  {openMenus.usuarios && (
                    <ul className="ml-8 mt-2 space-y-2">
                      <li><a href="/superAdmin/usuarios/agregar" className="hover:text-gray-400">Agregar Usuarios</a></li>
                      <li><a href="/superAdmin/usuarios/editar" className="hover:text-gray-400">Editar Usuarios</a></li>
                    </ul>
                  )}
                </li>

                {/* Tallas */}
                <li className="mb-4">
                  <div
                    className="flex items-center justify-between text-lg hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
                    onClick={() => toggleMenu('tallas')}
                  >
                    <div className="flex items-center">
                      <AiOutlineFileText className="mr-4 text-xl" />
                      <span>Tallas</span>
                    </div>
                    <AiOutlineDown className={`transition-transform ${openMenus.tallas ? 'rotate-180' : ''}`} />
                  </div>
                  {openMenus.tallas && (
                    <ul className="ml-8 mt-2 space-y-2">
                      <li><a href="/superAdmin/tallas/agregar" className="hover:text-gray-400">Agregar Tallas</a></li>
                      <li><a href="/superAdmin/tallas/editar" className="hover:text-gray-400">Editar Tallas</a></li>
                    </ul>
                  )}
                </li>

                {/* Categorías */}
                <li className="mb-4">
                  <div
                    className="flex items-center justify-between text-lg hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
                    onClick={() => toggleMenu('categorias')}
                  >
                    <div className="flex items-center">
                      <AiOutlineMenuFold className="mr-4 text-xl" />
                      <span>Categorías</span>
                    </div>
                    <AiOutlineDown className={`transition-transform ${openMenus.categorias ? 'rotate-180' : ''}`} />
                  </div>
                  {openMenus.categorias && (
                    <ul className="ml-8 mt-2 space-y-2">
                      <li><a href="/superAdmin/categorias/agregar" className="hover:text-gray-400">Agregar Categorías</a></li>
                      <li><a href="/superAdmin/categorias/editar" className="hover:text-gray-400">Editar Categorías</a></li>
                    </ul>
                  )}
                </li>

                {/* Productos */}
                <li className="mb-4">
                  <div
                    className="flex items-center justify-between text-lg hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
                    onClick={() => toggleMenu('productos')}
                  >
                    <div className="flex items-center">
                      <AiOutlineProduct className="mr-4 text-xl" />
                      <span>Productos</span>
                    </div>
                    <AiOutlineDown className={`transition-transform ${openMenus.productos ? 'rotate-180' : ''}`} />
                  </div>
                  {openMenus.productos && (
                    <ul className="ml-8 mt-2 space-y-2">
                      <li><a href="/superAdmin/productos/agregar" className="hover:text-gray-400">Agregar Productos</a></li>
                      <li><a href="/superAdmin/productos/editar" className="hover:text-gray-400">Editar Productos</a></li>
                    </ul>
                  )}
                </li>

                {/* Reportes */}
                <li className="mb-4">
                  <a href="/reportes" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-lg">
                    <AiOutlineFileText className="mr-4 text-xl" />
                    <span>Reportes</span>
                  </a>
                </li>

                {/* Configuración */}
                <li className="mb-4">
                  <a href="/superAdmin/configuracion" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-lg">
                    <AiFillSetting className="mr-4 text-xl" />
                    <span>Configuración</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Botón de Cerrar Sesión */}
            <div className={`mt-auto transition-opacity duration-300 ${isExpanded || isManuallyExpanded ? 'opacity-100' : 'opacity-0'}`}>
              <LogoutButton className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded-lg text-lg font-bold" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SidebarSuperAdmin;