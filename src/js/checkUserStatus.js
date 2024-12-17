import API_BASE_URL from './urlHelper.js';
import { logout as logoutAndRedirect } from './logout.js';
import { getIdUsuario, isTokenExpired } from '../utilities/jwtUtils.jsx';

export const checkStatus = async () => {
    await checkUserStatus();
};

// Función para verificar el estado del usuario
export const checkUserStatus = async () => {
    const token = localStorage.getItem('jwt');

    if (!token || isTokenExpired(token)) {
        // Desloguear si no hay token o está expirado
        console.warn('No hay token o está expirado');
        logoutAndRedirect();
        return;
    }

    const idUsuario = getIdUsuario(token);

    try {
        const response = await fetch(`${API_BASE_URL}/api/check-status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`  // Se manda el token como Authorization Header
            },
            body: JSON.stringify({ idUsuario })
        });

        if (response.ok) {
            const data = await response.json();
            // Si el estado es 'loggedOff', deslogueamos al usuario
            if (data.status === 'loggedOff') {
                console.warn('Usuario desconectado');
                logoutAndRedirect();  // Desloguear al usuario
            }
        } else if (response.status === 403) {
            // Manejar el 403 Forbidden (token inválido o expirado)
            const errorData = await response.json();
            console.error('Acceso prohibido: Token inválido o expirado');
            logoutAndRedirect();  // Desloguear al usuario
        } else {
            // Si la respuesta tiene otro error
            const errorData = await response.json();
            console.warn('Error al verificar el estado del usuario', errorData.message);
            logoutAndRedirect();  // Desloguear al usuario si hay error desconocido
        }
    } catch (error) {
        console.error('Error en checkUserStatus:', error);
        logoutAndRedirect();  // Desloguear en caso de error en la solicitud
    }
};
