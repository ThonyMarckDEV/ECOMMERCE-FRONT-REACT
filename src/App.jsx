import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation ,Navigate } from 'react-router-dom';
import './index.css';

//ComponentesHome
import Home from './ui/Home'; // Cambia './Home' al camino correcto si está en otra carpeta
import Productos from './ui/Productos'; // Cambia './Home' al camino correcto si está en otra carpeta
import Login from './ui/Login'; // Asegúrate de tener el componente Login
import Register from './ui/Register'; // Asegúrate de tener el componente Login

//UIS
//=====================================================================================================================
//UserUI
import Carrito from './ui/userUI/MiCarrito'; // Asegúrate de tener el componente Login
import MenuUser from './ui/userUI/MenuUser';
import Pedidos from './ui/userUI/MisPedidos';

//utilities
import ProtectedRouteHome from './utilities/ProtectedRouteHome'; // Importar el componente ProtectedRoute

import ProtectedRouteRol from './utilities/ProtectedRouteRol';

// Scripts para actividad y token
import { updateLastActivity } from './js/lastActivity';
import { checkStatus} from './js/checkUserStatus';




// Componente para manejar la lógica con useLocation
function AppContent() {
   const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      updateLastActivity();
      checkStatus();

      const intervalId = setInterval(() => {
        updateLastActivity();
      }, 30000); // Ejecutar cada 30 segundos

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [location.pathname]); // Ejecutar cada vez que cambie la ruta

  return (
    <Routes>

      <Route path="/" element={<Home />} />

       {/* Usar ProtectedRouteHome para login y registro */}
       <Route path="/login" element={<ProtectedRouteHome element={<Login />} />} />
       <Route path="/register" element={<ProtectedRouteHome element={<Register />} />} />
       {/* Usar ProtectedRouteHome para login y registro */}

       <Route path="/productos" element={<Productos />} />



      {/* Usar ProtectedRoute para UIUSER POR ROL cliente */}
       <Route path="/menuUsuario" element={<ProtectedRouteRol element={<MenuUser />} allowedRoles={['cliente']} />} />
       <Route path="/pedidos" element={<ProtectedRouteRol element={<Pedidos />} allowedRoles={['cliente']} />} />
       <Route path="/carrito" element={<ProtectedRouteRol element={<Carrito />} allowedRoles={['cliente']} />} />
      {/* Ruta no definida - Redirigir a la página principal */}
      <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirige a '/' */}
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

