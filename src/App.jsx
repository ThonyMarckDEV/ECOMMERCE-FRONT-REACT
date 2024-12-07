import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';


//ComponentesHome
import Home from './ui/Home'; // Cambia './Home' al camino correcto si está en otra carpeta
import Productos from './ui/Productos'; // Cambia './Home' al camino correcto si está en otra carpeta
import Login from './ui/Login'; // Asegúrate de tener el componente Login
import Register from './ui/Register'; // Asegúrate de tener el componente Login

//UIS
//=====================================================================================================================
//UserUI
import PerfilUser from './ui/userUI/PerfilUser'; // Asegúrate de tener el componente Login


//utilities
import ProtectedRouteHome from './utilities/ProtectedRouteHome'; // Importar el componente ProtectedRoute

import ProtectedRouteRol from './utilities/ProtectedRouteRol';

// Scripts para actividad y token
// import { updateLastActivity } from './js/lastActivity';
// import { checkToken, clearTokenCheckInterval } from './js/checkTokenIntervalanduserStatus';

// Componente para manejar la lógica con useLocation
function AppContent() {
  // const location = useLocation();

  // useEffect(() => {
  //   const token = localStorage.getItem('jwt');
  //   if (token) {
  //     updateLastActivity();
  //     checkToken();

  //     const intervalId = setInterval(() => {
  //       updateLastActivity();
  //     }, 30000); // Ejecutar cada 30 segundos

  //     return () => {
  //       clearInterval(intervalId);
  //       clearTokenCheckInterval();
  //     };
  //   }
  // }, [location.pathname]); // Ejecutar cada vez que cambie la ruta

  return (
    <Routes>

      <Route path="/" element={<Home />} />

       {/* Usar ProtectedRouteHome para login y registro */}
       <Route path="/login" element={<ProtectedRouteHome element={<Login />} />} />
       <Route path="/register" element={<ProtectedRouteHome element={<Register />} />} />
       {/* Usar ProtectedRouteHome para login y registro */}

       <Route path="/productos" element={<Productos />} />

      {/* Usar ProtectedRoute para UIUSER POR ROL cliente */}
       <Route path="/perfil" element={<ProtectedRouteRol element={<PerfilUser />} allowedRoles={['cliente']} />} />

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
