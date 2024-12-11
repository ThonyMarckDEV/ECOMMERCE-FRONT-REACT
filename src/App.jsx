import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation ,Navigate } from 'react-router-dom';
import './index.css';

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
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<ProtectedRouteHome element={<Login />} />} />
      <Route path="/register" element={<ProtectedRouteHome element={<Register />} />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/menuUsuario" element={<ProtectedRouteRol element={<MenuUser />} allowedRoles={['cliente']} />} />
      <Route path="/pedidos" element={<ProtectedRouteRol element={<Pedidos />} allowedRoles={['cliente']} />} />
      <Route path="/carrito" element={<ProtectedRouteRol element={<Carrito />} allowedRoles={['cliente']} />} />
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
