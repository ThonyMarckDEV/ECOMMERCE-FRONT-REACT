import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { logout } from '../../js/logout';
import jwtUtils from '../../utilities/jwtUtils';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { cantidadCarrito } = useCart();
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setIsAuthenticated(true);
      const profileImgUrl = jwtUtils.getPerfil(token);
      setProfileImage(profileImgUrl);
    } else {
      setIsAuthenticated(false);
    }

    // Añadir evento de scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <>
      {/* Div espaciador para evitar saltos en el contenido */}
      <div className="h-20" />
      
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        ${isScrolled 
          ? 'bg-black/95 backdrop-blur-sm shadow-lg' 
          : 'bg-black'} 
        border-b border-zinc-800`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-zinc-400 hover:text-white transition-colors duration-300"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <Link 
              to="/" 
              className="text-2xl tracking-widest text-white hover:text-zinc-200 transition-colors duration-300"
            >
              ECOMMERCE
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-12 text-sm tracking-wider">
              <Link 
                to="/" 
                className="text-zinc-300 hover:text-white transition-colors duration-300"
              >
                INICIO
              </Link>
              <Link 
                to="/productos" 
                className="text-zinc-300 hover:text-white transition-colors duration-300"
              >
                PRODUCTOS
              </Link>
              <button
                onClick={() => navigate('/?scrollTo=categories')}
                className="text-zinc-300 hover:text-white transition-colors duration-300"
              >
                CATEGORÍAS
              </button>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-8">
              {isAuthenticated && (
                <Link to="/carrito" className="relative group">
                  <ShoppingBag className="h-6 w-6 text-zinc-300 group-hover:text-white transition-colors duration-300" />
                  {cantidadCarrito > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-white text-black text-xs flex items-center justify-center font-medium">
                      {cantidadCarrito}
                    </span>
                  )}
                </Link>
              )}

              <div className="relative profile-menu-container">
                <button
                  onClick={isAuthenticated ? toggleProfileMenu : () => navigate('/login')}
                  className="focus:outline-none group"
                >
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-zinc-800 group-hover:ring-zinc-600 transition-all duration-300" 
                    />
                  ) : (
                    <User className="h-6 w-6 text-zinc-300 group-hover:text-white transition-colors duration-300" />
                  )}
                </button>

                {isProfileMenuOpen && isAuthenticated && (
                  <div className="absolute right-0 mt-3 w-48 bg-zinc-900/95 backdrop-blur-sm rounded-lg shadow-xl py-1 text-sm border border-zinc-800">
                    <button
                      onClick={() => {
                        navigate('/menuUsuario');
                        setIsProfileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors duration-300"
                    >
                      Mi Cuenta
                    </button>
                    <button
                      onClick={() => {
                        navigate('/pedidos');
                        setIsProfileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors duration-300"
                    >
                      Mis Pedidos
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsAuthenticated(false);
                        setIsProfileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-400 hover:bg-zinc-800 hover:text-red-300 transition-colors duration-300"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 transition-all duration-300 ${
            isMenuOpen ? 'max-h-48' : 'max-h-0'
          } overflow-hidden`}
        >
          <div className="px-4 py-2 space-y-1">
            <Link 
              to="/" 
              className="block py-2 text-zinc-300 hover:text-white transition-colors duration-300"
            >
              INICIO
            </Link>
            <Link 
              to="/productos" 
              className="block py-2 text-zinc-300 hover:text-white transition-colors duration-300"
            >
              PRODUCTOS
            </Link>
            <button
              onClick={() => {
                navigate('/?scrollTo=categories');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-zinc-300 hover:text-white transition-colors duration-300"
            >
              CATEGORÍAS
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;