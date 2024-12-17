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
        console.warn('no hay token o está expirado');
        // logoutAndRedirect();
        return;
    }

    const idUsuario = getIdUsuario(token);

    try {
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
            if (data.status === 'loggedOff') {
                console.warn('usuario loggedoff');
               //  logoutAndRedirect();
            }
        } else {
            // Manejo de respuestas no exitosas
            console.warn('Error al verificar el estado del usuario');
            // logoutAndRedirect();
        }
    } catch (error) {
        console.error('Error en checkUserStatus:', error);
        // logoutAndRedirect();
    }
};
