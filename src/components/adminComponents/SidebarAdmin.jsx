import React, { useState, useEffect } from 'react';
import LogoutButton from './LogoutButton';
import {
  AiOutlineProduct,
  AiOutlineDown,
  AiOutlineMenu,
} from 'react-icons/ai';

function SidebarAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openProductos, setOpenProductos] = useState(false);

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
            <h2 className="text-3xl font-bold mb-8 text-center text-white">Menú</h2>
            <ul>

              {/* Productos */}
              <li className="mb-4">
                <div
                  className="flex items-center justify-between text-lg hover:bg-gray-700 p-2 rounded-lg cursor-pointer transition-all duration-300"
                  onClick={() => setOpenProductos(!openProductos)}
                >
                  <div className="flex items-center">
                    <AiOutlineProduct className="mr-4 text-xl" />
                    <span>Producto</span>
                  </div>
                  <AiOutlineDown className={`transition-transform ${openProductos ? 'rotate-180' : ''}`} />
                </div>
                {openProductos && (
                  <ul className="ml-8 mt-2 space-y-2">
                    <li>
                      <a href="/admin/productos/agregar" className="hover:text-gray-400 transition-all duration-300">
                        Agregar Productos
                      </a>
                    </li>
                    <li>
                      <a href="/admin/productos/editar" className="hover:text-gray-400 transition-all duration-300">
                        Editar Productos
                      </a>
                    </li>
                  </ul>
                )}
              </li>



            </ul>
          </div>

          {/* Botón de Cerrar Sesión */}
          <div className="mt-auto">
            <LogoutButton className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded-lg text-lg font-bold transition-all duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarAdmin;
