import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation ,Navigate } from 'react-router-dom';
import './index.css';
import VerificarCorreo from './ui/VerificarCorreo';  // Asegúrate de que la ruta sea la correcta
import VerificarCorreoToken from './ui/VerificarCorreoToken';  // Asegúrate de que la ruta sea la correcta

// ComponentesHome
import Home from './ui/Home'; 
import Productos from './ui/Productos'; 
import Login from './ui/Login'; 
import Register from './ui/Register'; 

// UIS
import Carrito from './ui/userUI/MiCarrito'; 
import MenuUser from './ui/userUI/MenuUser';
import Pedidos from './ui/userUI/MisPedidos';

// Utilities
import ProtectedRouteHome from './utilities/ProtectedRouteHome';
import ProtectedRouteRol from './utilities/ProtectedRouteRol';
import ProtectedRouteToken from './utilities/ProtectedRouteToken';

// Scripts
import { updateLastActivity } from './js/lastActivity';
import { checkStatus} from './js/checkUserStatus';

// Context del carrito
import { CartProvider } from './context/CartContext'; // Importar el CartProvider

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      updateLastActivity();
      checkStatus();

      const intervalId = setInterval(() => {
        updateLastActivity();
      }, 30000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<ProtectedRouteHome element={<Home />} />} />
      <Route path="/login" element={<ProtectedRouteHome element={<Login />} />} />
      <Route path="/register" element={<ProtectedRouteHome element={<Register />} />} />
      <Route path="/productos" element={<ProtectedRouteHome element={<Productos />} />} />

      <Route path="/menuUsuario" element={<ProtectedRouteRol element={<MenuUser />} allowedRoles={['cliente']} />} />
      <Route path="/pedidos" element={<ProtectedRouteRol element={<Pedidos />} allowedRoles={['cliente']} />} />
      <Route path="/carrito" element={<ProtectedRouteRol element={<Carrito />} allowedRoles={['cliente']} />} />

      <Route path="/verificar-correo" element={<ProtectedRouteToken element={<VerificarCorreo />} />} />
      <Route path="/verificar-correo-token" element={<VerificarCorreoToken />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <CartProvider> {/* Proveedor de contexto */}
        <AppContent />
      </CartProvider>
    </Router>
  );
}

export default App;
