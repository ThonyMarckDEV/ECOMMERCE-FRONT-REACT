// jwtUtils.jsx

import API_BASE_URL from '../js/urlHelper';

// Función para decodificar el payload de un JWT manualmente
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1]; // Obtén la parte del payload
    if (!base64Url) throw new Error("Token inválido o incompleto");
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Normaliza el formato Base64Url
    const jsonPayload = atob(base64); // Decodifica Base64 a texto plano
    return JSON.parse(jsonPayload); // Convierte el texto en un objeto JSON
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Función para obtener el perfil (imagen de perfil) con la URL base concatenada
export const getPerfil = (token) => {
  const decodedToken = decodeToken(token);
  if (decodedToken) {
    // Asumiendo que la URL base de la API es algo como 'http://127.0.0.1:8000/storage/'
    const baseUrl = `${API_BASE_URL}/storage/`;
    return decodedToken.perfil ? `${baseUrl}${decodedToken.perfil}` : ''; // Concatenamos la URL base con el perfil
  }
  return ''; // Si el token es inválido o no tiene perfil
};
// Función para obtener el ID del usuario
export const getIdUsuario = (token) => decodeToken(token)?.idUsuario ?? null;

// Función para obtener el nombre de usuario
export const getUsername = (token) => decodeToken(token)?.username ?? null;

// Función para obtener el rol del usuario
export const getUserRole = (token) => decodeToken(token)?.rol ?? null;

// Función para verificar si el token está expirado
export const isTokenExpired = (token) => {
  const decodedToken = decodeToken(token);
  if (decodedToken?.exp) {
    const currentTime = Date.now() / 1000; // Tiempo actual en segundos
    return decodedToken.exp < currentTime;
  }
  return true; // Si no hay exp, considera el token como expirado
};

// Función para obtener la fecha de expiración
export const getTokenExpirationDate = (token) => {
  const exp = decodeToken(token)?.exp;
  return exp ? new Date(exp * 1000) : null;
};

// Función para verificar el token de manera general
export const verifyToken = (token) => {
  if (!token) {
    return { valid: false, message: "Token no proporcionado" };
  }
  
  if (isTokenExpired(token)) {
    return { valid: false, message: "Token expirado" };
  }
  
  return { valid: true, message: "Token válido" };
};

export default {
  getPerfil,
  getIdUsuario,
  getUsername,
  getUserRole,
  isTokenExpired,
  getTokenExpirationDate,
  verifyToken
};