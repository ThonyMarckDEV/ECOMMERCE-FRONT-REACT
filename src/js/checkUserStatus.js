import API_BASE_URL from './urlHelper.js';
import { logout as logoutAndRedirect } from './logout.js';
import jwtUtils from '../utilities/jwtUtils.jsx';

export const checkStatus = async () => {
    await checkUserStatus();
};

// Función para verificar el estado del usuario
export const checkUserStatus = async () => {
    const token = jwtUtils.getTokenFromCookie(); // Obtener token desde la cookie

    if (!token || jwtUtils.isTokenExpired(token)) {
        // Si no hay token o está expirado, deslogueamos al usuario
        console.warn('No hay token o está expirado');
        logoutAndRedirect();  // Aquí se debe hacer logout y redirigir
        return;
    }

    const idUsuario = jwtUtils.getIdUsuario(token);

    try {
        // Enviar solicitud para verificar el estado y el token en la base de datos
        const response = await fetch(`${API_BASE_URL}/api/check-status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ idUsuario })
        });

        if (response.ok) {
            const data = await response.json();

            // Verificamos si el token en la base de datos es distinto al token de la cookie
            if (data.token !== token) {
                console.warn('Token en la base de datos no coincide con el local');
                jwtUtils.removeTokenFromCookie();  // Eliminar el token de la cookie
                window.location.href = '/';  // Redirigir a la página de inicio o login
            }
        } else if (response.status === 403) {
            // Si la respuesta es 403, el token no coincide o es inválido
            console.error('Error 403: Token no válido o no coincide con el almacenado en la base de datos');
            jwtUtils.removeTokenFromCookie();  // Eliminar el token de la cookie
            window.location.href = '/';  // Redirigir a la página de inicio o login
        } else {
            console.error('Error en la respuesta del servidor:', response.statusText);
            jwtUtils.removeTokenFromCookie();  // Eliminar el token de la cookie
            window.location.href = '/';  // Redirigir a la página de inicio o login
        }
    } catch (error) {
        // Si ocurre un error durante la solicitud, deslogueamos al usuario
        console.error('Error en checkUserStatus:', error);
        logoutAndRedirect();  // Desloguear en caso de error
    }
};