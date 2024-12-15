// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importa de manera correcta
import jwtUtils from '../utilities/jwtUtils'; // Asegúrate de tener esta utilidad para decodificar el token

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
    // Si hay token, decodificar el JWT y verificar el estado de emailVerified
    const emailVerified = jwtUtils.getEmailVerified(token);
    if(emailVerified === 0){
      return <Navigate to="/" />;
    }else{
       // Verificar si el rol del usuario está permitido para esta ruta
       if (allowedRoles.includes(userRole)) {
        return element; // El usuario tiene el rol adecuado, se permite el acceso
      }else{
        return <Navigate to="/" />;
      }
    }



  } catch (error) {
    // Si el token no es válido o no se puede decodificar, redirigir a home
     return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
