// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import jwtUtils from '../utilities/jwtUtils'; // Utilidad para emailVerified

const ProtectedRouteCliente = ({ element, allowedRoles }) => {
  // Obtener el JWT desde localStorage
  const token = jwtUtils.getTokenFromCookie();

  if (!token) {
    // Si no hay token, redirigir al login
    return <Navigate to="/" />;
  }

  try {
     // Decodificar el JWT
     const userRole = jwtUtils.getUserRole(token); // Extraer el rol del token
     const emailVerified = jwtUtils.getEmailVerified(token); // Verificar email
 
     // Si el email no está verificado
     if (emailVerified === 0) {
       return <Navigate to="/verificar-correo" />;
     }
 
     // Redirigir dependiendo del rol
     if (userRole === 'admin') {
       return <Navigate to="/admin/productos/agregar" />;
       
     } else if (userRole === 'superadmin') {
       return <Navigate to="/superAdmin" />;

     }
     return element;
   } catch (error) {
     console.error('Error al decodificar el token:', error);
     return <Navigate to="/" />; // Token inválido
   }
};

export default ProtectedRouteCliente;
