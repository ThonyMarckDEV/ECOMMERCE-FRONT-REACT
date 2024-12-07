import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-black text-white py-4 px-6">
      <div className="flex items-center justify-between">
        {/* Nombre de la empresa */}
        <a href="/" className="block py-2 px-4 hover:bg-gray-700 font-bold">
        <div className="text-xl font-bold">
          ECOMMERCE
        </div>
        </a>

        {/* Categorías para pantallas grandes */}
        <div className="hidden md:flex space-x-8 flex-1 justify-center">
          <a href="/productos" className="hover:text-gray-400 font-bold">
            Productos
          </a>
          <a href="#categoria2" className="hover:text-gray-400 font-bold">
            Categoría 2
          </a>
          <a href="#categoria3" className="hover:text-gray-400 font-bold">
            Categoría 3
          </a>
        </div>

        {/* Botón del menú para móviles */}
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Carrito de compras */}
        <div className="relative">
          <button className="hover:text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l1.6-8H6.4M16 16a2 2 0 11-4 0M10 16a2 2 0 11-4 0"
              />
            </svg>
          </button>
          {/* Indicador del número de productos en el carrito */}
          <span className="absolute top-0 right-1 -mt-3 -mr-3 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black bg-white rounded-full">
            3
          </span>
        </div>
      </div>

      {/* Menú desplegable en móviles */}
      <div
        className={`md:hidden mt-4 ${isMenuOpen ? 'block' : 'hidden'}`}
      >
        <a href="/productos" className="block py-2 px-4 hover:bg-gray-700 font-bold">
          Productos 1
        </a>
        <a href="#categoria2" className="block py-2 px-4 hover:bg-gray-700 font-bold">
          Categoría 2
        </a>
        <a href="#categoria3" className="block py-2 px-4 hover:bg-gray-700 font-bold">
          Categoría 3
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
