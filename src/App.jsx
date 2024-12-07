import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import Home from './ui/Home'; // Cambia './Home' al camino correcto si está en otra carpeta

import Productos from './ui/Productos'; // Cambia './Home' al camino correcto si está en otra carpeta

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
      <Route path="/productos" element={<Productos />} />
      {/* <Route path="/login" element={<Login />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/contacto" element={<Contacto />} /> */}
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
