// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importa de manera correcta

const ProtectedRoute = ({ element, allowedRoles }) => {
  // Obtener el JWT desde localStorage, cookies, o donde lo almacenes
  const token = localStorage.getItem('jwt'); // Cambia esta línea si usas otro método de almacenamiento

   if (!token) {
     // Si no hay token, redirigir al login
     return <Navigate to="/" />;
   }

  try {
    // Decodificar el JWT
    const decodedToken = jwtDecode(token); // Usamos jwtDecode aquí
    const userRole = decodedToken.rol; // Asumiendo que el rol está en el JWT

    // Verificar si el rol del usuario está permitido para esta ruta
    if (allowedRoles.includes(userRole)) {
      return element; // El usuario tiene el rol adecuado, se permite el acceso
    } else {
      // Si no tiene el rol, redirigir a una página de acceso denegado o home
      return <Navigate to="/" />;
    }
  } catch (error) {
    // Si el token no es válido o no se puede decodificar, redirigir al login
     return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
