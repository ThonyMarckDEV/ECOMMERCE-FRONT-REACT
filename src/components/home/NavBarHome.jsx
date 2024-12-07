import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../js/logout'; // Cambiar a importación nombrada
import jwtUtils from '../../utilities/jwtUtils'; // Importar las utilidades JWT

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Verificación de autenticación
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Verificar si el menú de perfil está abierto
  const navigate = useNavigate(); // Inicializamos useNavigate

  // Estado para la foto de perfil
  const [profileImage, setProfileImage] = useState('');

  // Verificar si hay token en el localStorage al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setIsAuthenticated(true); // Si hay token, está autenticado
      const profileImgUrl = jwtUtils.getPerfil(token); // Obtener URL de la imagen del perfil desde el token
      setProfileImage(profileImgUrl); // Establecer la imagen de perfil
    } else {
      setIsAuthenticated(false); // Si no hay token, no está autenticado
    }
  }, []);
  

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen); // Cambia el estado de visibilidad del menú de perfil
  };

  const goToProfile = () => {
    navigate('/perfil'); // Redirige a la página de perfil
  };

  // Llamamos al logout.js cuando el usuario hace click en "Cerrar sesión"
  const handleLogout = () => {
    logout(); // Llama a la función del archivo logout.js
    setIsAuthenticated(false); // Actualiza el estado de autenticación
    setIsProfileMenuOpen(false);
  };

  const handleCategoriesClick = () => {
    navigate('/?scrollTo=categories'); // Redirige a la página principal con un query param
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
          <a href="/" className="hover:text-gray-400 font-bold">
            Home
          </a>
          <a href="/productos" className="hover:text-gray-400 font-bold">
            Productos
          </a>
          <button
            onClick={handleCategoriesClick}
            className="hover:text-gray-400 font-bold"
          >
            Categorías
          </button>
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
        <div className="relative ml-12 sm:ml-4 md:ml-6">
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

          {/* Mostrar el indicador solo si hay token */}
          {localStorage.getItem('jwt') && (
            <span className="absolute top-0 right-1 -mt-3 -mr-3 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black bg-white rounded-full">
              3
            </span>
          )}
        </div>

        {/* Ícono de perfil */}
        <div className="relative ml-4">
          <button
            onClick={isAuthenticated ? toggleProfileMenu : () => navigate('/login')} // Si está autenticado, abre el menú; si no, redirige al login
            className="hover:text-gray-400"
          >
            {profileImage ? (
              <img
                src={profileImage} // Mostrar la imagen del perfil
                alt="Perfil"
                className="w-8 h-8 rounded-full"
              />
            ) : (
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
                  d="M5 3v3h14V3m-7 4v9m0 0H5m7 0h7m-7 0v5"
                />
              </svg>
            )}
          </button>

          {/* Menú desplegable de perfil */}
          {isProfileMenuOpen && isAuthenticated && (
            <div className="absolute right-0 mt-2 bg-white text-black border border-gray-300 rounded-lg shadow-lg w-48 z-10">
              <ul>
                <li>
                  <button
                    onClick={goToProfile}
                    className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                  >
                    Mi perfil
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/addresses')} // Redirige a la página de direcciones
                    className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                  >
                    Direcciones
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout} // Cierra sesión
                    className="block px-4 py-2 hover:bg-gray-200 w-full text-left text-red-600"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Menú desplegable en móviles */}
      <div
        className={`md:hidden mt-4 ${isMenuOpen ? 'block' : 'hidden'}`}
      >
        <a href="/" className="block py-2 px-4 hover:bg-gray-700 font-bold">
          Home
        </a>
        <a href="/productos" className="block py-2 px-4 hover:bg-gray-700 font-bold">
          Productos
        </a>
        <button
          onClick={handleCategoriesClick}
          className="block py-2 px-4 hover:bg-gray-700 font-bold text-left w-full"
        >
          Categorías
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
