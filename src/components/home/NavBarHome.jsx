import React, { useState, useEffect } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import { logout } from '../../js/logout'; // Cambiar a importación nombrada
import jwtUtils from '../../utilities/jwtUtils'; // Importar las utilidades JWT
import API_BASE_URL from '../../js/urlHelper'; // Asegúrate de tener la URL base de tu API

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Verificación de autenticación
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Verificar si el menú de perfil está abierto
  const navigate = useNavigate(); // Inicializamos useNavigate
  const [cantidadCarrito, setCantidadCarrito] = useState(0);
  const [loading, setLoading] = useState(false);
  
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

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('jwt');
      if (!token) return;
  
      const idUsuario = jwtUtils.getIdUsuario(token);
      if (!idUsuario) return;
  
      setLoading(true);
  
      fetch(`${API_BASE_URL}/api/carrito/cantidad?idUsuario=${idUsuario}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setCantidadCarrito(data.cantidad || 0);
      })
      .catch(err => {
        console.error('Error al obtener cantidad del carrito:', err);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [isAuthenticated]);

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
    logout(); // Cierra sesión
    setIsAuthenticated(false); 
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
          className="md:hidden focus:outline-none -ml-10"
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

        {/* Contenedor Flex para los íconos del carrito y perfil */}
        <div className="flex items-center space-x-2 md:space-x-6">
          
         {/* Carrito de compras */}
          <div className="relative">
            <Link to="/carrito">
              <button
                className="hover:text-gray-400 transition-colors duration-200 focus:outline-none"
                aria-label="Carrito de compras"
                title="Carrito de compras"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-12 h-12 md:w-10 md:h-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l1.6-8H6.4M16 16a2 2 0 11-4 0M10 16a2 2 0 11-4 0"
                  />
                </svg>
              </button>
            </Link>

            {/* Mostrar el indicador si hay token y cantidadCarrito > 0 */}
            {isAuthenticated && cantidadCarrito > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center px-3 py-1 text-xs font-bold leading-none text-black bg-white rounded-full">
                {cantidadCarrito}
              </span>
            )}
          </div>

          {/* Ícono de perfil */}
          <div className="relative">
            <button
              onClick={isAuthenticated ? toggleProfileMenu : () => navigate('/login')}
              className="hover:text-gray-400 transition-colors duration-200 focus:outline-none"
              aria-label="Perfil de usuario"
              title="Perfil de usuario"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Perfil"
                  className="w-12 h-12 md:w-10 md:h-10 rounded-full"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-12 h-12 md:w-10 md:h-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.739.565 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
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
                      onClick={() => navigate('/agregar/direcciones')} // Redirige a la página de direcciones
                      className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                    >
                      Agregar Direccion
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/direcciones')} // Redirige a la página de direcciones
                      className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                    >
                      Mis Direcciones
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/pedidos')} // Redirige a la página de direcciones
                      className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                    >
                      Mis Pedidos
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
