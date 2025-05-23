import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './index.css';
import VerificarCorreo from './ui/VerificarCorreo';
import VerificarCorreoToken from './ui/VerificarCorreoToken';
import Mantenimiento from './components/home/Mantenimiento'; // Componente de mantenimiento
import API_BASE_URL from './js/urlHelper';

import WelcomeScreen from './components/WelcomeScreen'; // Importa el componente de pantal

// Componentes Home
import Home from './ui/Home';
import Productos from './ui/Productos';
import Login from './ui/Login';
import Register from './ui/Register';

// UIS
//USERUI
import Carrito from './ui/userUI/MiCarrito';
import MenuUser from './ui/userUI/MenuUser';
import Pedidos from './ui/userUI/MisPedidos';

//SUPERADMINUI
import SuperAdmin from './ui/superadminUI/SuperAdmin';
import EditarUsuario from './ui/superadminUI/EditarUsuario';
import AgregarCategoria from './ui/superadminUI/AgregarCategoria';
import EditarCategoria from './ui/superadminUI/EditarCategoria';
import AgregarTalla from './ui/superadminUI/AgregarTalla';
import EditarTalla from './ui/superadminUI/EditarTalla';
import AgregarUsuario from './ui/superadminUI/AgregarUsuario';
import Configuracion from './ui/superadminUI/Configuracion';

//ADMINUI
import AgregarProductoAdmin from './ui/adminUI/AgregarProductoAdmin';
import EditarProductoAdmin from './ui/adminUI/EditarProductoAdmin';

// Utilities
import ProtectedRouteHome from './utilities/ProtectedRouteHome';
import ProtectedRouteRolCliente from './utilities/ProtectedRouteRolCliente';
import ProtectedRouteRolSuperAdmin from './utilities/ProtectedRouteRolSuperAdmin';
import ProtectedRouteToken from './utilities/ProtectedRouteToken';
import ProtectedRouteRolAdmin from './utilities/ProtectedRouteRolAdmin';
import AgregarProducto from './ui/superadminUI/AgregarProducto';
import EditarProducto from './ui/superadminUI/EditarProducto';

// Scripts
import { updateLastActivity } from './js/lastActivity';


// Context del carrito
import { CartProvider } from './context/CartContext';

//EFECTOS
import SnowEffect from './effects/SnowEffect'; // Importa el componente de nieve
import FireworksEffect from './effects/FireworksEffect';
import jwtUtils from './utilities/jwtUtils';

function AppContent() {
  const [enMantenimiento, setEnMantenimiento] = useState(false);
  const [mensajeMantenimiento, setMensajeMantenimiento] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true); // Estado para controlar la visibilidad de WelcomeScreen
  const location = useLocation();

  // Verificar estado de mantenimiento al cargar
  useEffect(() => {
    const verificarMantenimiento = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/status-mantenimiento`);
        if (response.ok) {
          const data = await response.json();
          if (data.estado === 1) {
            setEnMantenimiento(true);
            setMensajeMantenimiento(data.mensaje);
          } else {
            setEnMantenimiento(false);
          }
        } else {
          console.error('Error al obtener el estado de mantenimiento.');
        }
      } catch (error) {
        console.error('Error en la solicitud de mantenimiento:', error);
      } finally {
        setIsLoading(false); // Finaliza la carga
      }
    };

    // Temporizador para mostrar WelcomeScreen durante 5 segundos
    const welcomeScreenTimer = setTimeout(() => {
      setShowWelcomeScreen(false); // Oculta WelcomeScreen después de 5 segundos
    }, 1500);

    verificarMantenimiento();

    return () => {
      clearTimeout(welcomeScreenTimer); // Limpia el temporizador si el componente se desmonta
    };
  }, [location.pathname]);

  // Actualizar la actividad del usuario si no está en mantenimiento
  useEffect(() => {
    const token = jwtUtils.getTokenFromCookie();
    if (!enMantenimiento && token) {
      updateLastActivity();

      const intervalId = setInterval(() => {
        updateLastActivity();
      }, 10000);

      return () => clearInterval(intervalId);
    }
  }, [location.pathname, enMantenimiento]);

  if (isLoading || showWelcomeScreen) {
    return <WelcomeScreen />; // Muestra la pantalla de carga mientras se verifica el estado o durante 5 segundos
  }

  if (enMantenimiento) {
    return <Mantenimiento mensaje={mensajeMantenimiento} />;
  }

  return (
    <Routes>
      {/* ACA VAN EFECTOS */}
      {/*<SnowEffect />  Agrega el efecto de nieve aquí */}
      {/* <FireworksEffect /> */}
      <Route path="/" element={<ProtectedRouteHome element={<Home />} />} />

      <Route path="/login" element={<ProtectedRouteHome element={<Login />} />} />
      <Route path="/register" element={<ProtectedRouteHome element={<Register />} />} />
      <Route path="/productos" element={<ProtectedRouteHome element={<Productos />} />} />

      {/* RUTAS ROL SUPERADMIN */}
      <Route path="/superAdmin" element={<ProtectedRouteRolSuperAdmin element={<SuperAdmin />} />} />
      <Route path="/superAdmin/usuarios/agregar" element={<ProtectedRouteRolSuperAdmin element={<AgregarUsuario />} />} />
      <Route path="/superAdmin/usuarios/editar" element={<ProtectedRouteRolSuperAdmin element={<EditarUsuario />} />} />
      <Route path="/superAdmin/categorias/agregar" element={<ProtectedRouteRolSuperAdmin element={<AgregarCategoria />} />} />
      <Route path="/superAdmin/categorias/editar" element={<ProtectedRouteRolSuperAdmin element={<EditarCategoria />} />} />
      <Route path="/superAdmin/tallas/agregar" element={<ProtectedRouteRolSuperAdmin element={<AgregarTalla />} />} />
      <Route path="/superAdmin/tallas/editar" element={<ProtectedRouteRolSuperAdmin element={<EditarTalla />} />} />
      <Route path="/superAdmin/configuracion" element={<ProtectedRouteRolSuperAdmin element={<Configuracion />} />} />
      <Route path="/superAdmin/productos/agregar" element={<ProtectedRouteRolSuperAdmin element={<AgregarProducto />} />} />
      <Route path="/superAdmin/productos/editar" element={<ProtectedRouteRolSuperAdmin element={<EditarProducto />} />} />

      {/* RUTAS ROL ADMIN*/}
      <Route path="/admin/productos/agregar" element={<ProtectedRouteRolAdmin element={<AgregarProductoAdmin />} />} />
      <Route path="/admin/productos/editar" element={<ProtectedRouteRolAdmin element={<EditarProductoAdmin />} />} />

      {/* RUTAS ROL CLIENTE */}
      <Route path="/menuUsuario" element={<ProtectedRouteRolCliente element={<MenuUser />} allowedRoles={['cliente']} />} />
      <Route path="/pedidos" element={<ProtectedRouteRolCliente element={<Pedidos />} allowedRoles={['cliente']} />} />
      <Route path="/carrito" element={<ProtectedRouteRolCliente element={<Carrito />} allowedRoles={['cliente']} />} />

      <Route path="/verificar-correo" element={<ProtectedRouteToken element={<VerificarCorreo />} />} />
      <Route path="/verificar-correo-token" element={<VerificarCorreoToken />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </Router>
  );
}

export default App;