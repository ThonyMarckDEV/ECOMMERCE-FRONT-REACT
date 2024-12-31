import React, { useState, useEffect } from 'react';
import LogoutButton from './LogoutButton';
import { Menu, Transition } from '@headlessui/react'; // Importar componentes de Headless UI
import {
  AiFillHome,
  AiFillSetting,
  AiOutlineFileText,
  AiOutlineUser,
  AiOutlineDown,
  AiOutlineMenu,
} from 'react-icons/ai';

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        className="menu-button lg:hidden fixed top-4 left-4 z-50 text-black bg-white p-3 rounded-lg focus:outline-none hover:bg-gray-100 transition-all duration-300 shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <AiOutlineMenu className="text-2xl" />
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar fixed lg:relative top-0 left-0 h-full bg-white text-black shadow-lg p-6 w-64 transform lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:block transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            {/* Título del menú */}
            <h2 className="text-3xl font-bold mb-8 text-center text-black">Admin Panel</h2>
            <ul>
              {/* Dashboard */}
              <li className="mb-4">
                <a
                  href="/dashboard"
                  className="flex items-center text-lg hover:bg-gray-100 p-3 rounded-lg transition-all duration-300 hover:text-black"
                >
                  <AiFillHome className="mr-4 text-xl" />
                  <span>Dashboard</span>
                </a>
              </li>

              {/* Usuarios */}
              <Menu as="li" className="mb-4">
                {({ open }) => (
                  <>
                    <Menu.Button className="flex items-center justify-between text-lg hover:bg-gray-100 p-3 rounded-lg cursor-pointer transition-all duration-300 hover:text-black w-full">
                      <div className="flex items-center">
                        <AiOutlineUser className="mr-4 text-xl" />
                        <span>Usuarios</span>
                      </div>
                      <AiOutlineDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                    </Menu.Button>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="ml-8 mt-2 space-y-2">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/usuarios/agregar"
                              className={`block hover:text-black transition-all duration-300 ${
                                active ? 'bg-gray-100' : ''
                              }`}
                            >
                              Agregar Usuarios
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="admin/usuarios/editar"
                              className={`block hover:text-black transition-all duration-300 ${
                                active ? 'bg-gray-100' : ''
                              }`}
                            >
                              Editar Usuarios
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>

              {/* Tallas */}
              <Menu as="li" className="mb-4">
                {({ open }) => (
                  <>
                    <Menu.Button className="flex items-center justify-between text-lg hover:bg-gray-100 p-3 rounded-lg cursor-pointer transition-all duration-300 hover:text-black w-full">
                      <div className="flex items-center">
                        <AiOutlineFileText className="mr-4 text-xl" />
                        <span>Tallas</span>
                      </div>
                      <AiOutlineDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                    </Menu.Button>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="ml-8 mt-2 space-y-2">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/tallas/agregar"
                              className={`block hover:text-black transition-all duration-300 ${
                                active ? 'bg-gray-100' : ''
                              }`}
                            >
                              Agregar Tallas
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/tallas/editar"
                              className={`block hover:text-black transition-all duration-300 ${
                                active ? 'bg-gray-100' : ''
                              }`}
                            >
                              Editar Tallas
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>

              {/* Categorías */}
              <Menu as="li" className="mb-4">
                {({ open }) => (
                  <>
                    <Menu.Button className="flex items-center justify-between text-lg hover:bg-gray-100 p-3 rounded-lg cursor-pointer transition-all duration-300 hover:text-black w-full">
                      <div className="flex items-center">
                        <AiFillSetting className="mr-4 text-xl" />
                        <span>Categorías</span>
                      </div>
                      <AiOutlineDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                    </Menu.Button>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="ml-8 mt-2 space-y-2">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/admin/categorias/agregar"
                              className={`block hover:text-black transition-all duration-300 ${
                                active ? 'bg-gray-100' : ''
                              }`}
                            >
                              Agregar Categorías
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/admin/categorias/editar"
                              className={`block hover:text-black transition-all duration-300 ${
                                active ? 'bg-gray-100' : ''
                              }`}
                            >
                              Editar Categorías
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>

              {/* Reportes */}
              <li className="mb-4">
                <a
                  href="/reportes"
                  className="flex items-center text-lg hover:bg-gray-100 p-3 rounded-lg transition-all duration-300 hover:text-black"
                >
                  <AiOutlineFileText className="mr-4 text-xl" />
                  <span>Reportes</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Botón de Cerrar Sesión */}
          <div className="mt-auto">
            <LogoutButton className="bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-lg text-lg font-bold transition-all duration-300 shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;