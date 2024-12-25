import React, { createContext, useState, useEffect, useContext } from 'react';
import API_BASE_URL from '../js/urlHelper';
import jwtUtils from '../utilities/jwtUtils';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cantidadCarrito, setCantidadCarrito] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true; // Flag para verificar si el componente está montado
    const token = localStorage.getItem('jwt');
    const location = window.location.pathname; // Obtener la ruta actual

    // No realizar la solicitud si estamos en la ruta /admin
    if (token && !location.startsWith('/admin')) {
      const idUsuario = jwtUtils.getIdUsuario(token);
      if (!idUsuario) return;

      setLoading(true);
      fetch(`${API_BASE_URL}/api/carrito/cantidad?idUsuario=${idUsuario}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (isMounted) { // Solo actualizar si el componente sigue montado
          setCantidadCarrito(data.cantidad || 0);
        }
      })
      .catch(err => {
        console.error('Error al obtener cantidad del carrito:', err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    }

    return () => {
      isMounted = false; // Limpiar el flag cuando el componente se desmonte
    };
  }, []); // Solo se ejecuta una vez al montar el componente

  const updateCartCount = () => {
    const token = localStorage.getItem('jwt');
    const location = window.location.pathname;

    // No realizar la solicitud si estamos en la ruta /admin
    if (token && !location.startsWith('/admin') && !location.startsWith('/marca') ) {
      const idUsuario = jwtUtils.getIdUsuario(token);
      fetch(`${API_BASE_URL}/api/carrito/cantidad?idUsuario=${idUsuario}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setCantidadCarrito(data.cantidad || 0);
      })
      .catch(err => console.error('Error actualizando carrito:', err));
    }
  };

  return (
    <CartContext.Provider value={{ cantidadCarrito, loading, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
