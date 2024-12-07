import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  // Obtener el JWT desde localStorage
  const token = localStorage.getItem('jwt');

  if (token) {
    // Si hay token, redirigir al home
    return <Navigate to="/" />;
  }

  // Si no hay token, se muestra el elemento
  return element;
};

export default ProtectedRoute;
