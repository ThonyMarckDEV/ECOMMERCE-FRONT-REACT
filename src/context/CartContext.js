import React, { createContext, useState, useEffect, useContext } from 'react';
import API_BASE_URL from '../js/urlHelper';
import jwtUtils from '../utilities/jwtUtils';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cantidadCarrito, setCantidadCarrito] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
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
        setCantidadCarrito(data.cantidad || 0);
      })
      .catch(err => {
        console.error('Error al obtener cantidad del carrito:', err);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, []);

  const updateCartCount = () => {
    const token = localStorage.getItem('jwt');
    if (token) {
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
