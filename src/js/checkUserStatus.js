import API_BASE_URL from './urlHelper.js';
import { logout as logoutAndRedirect } from './logout.js';
import { getIdUsuario, isTokenExpired } from '../utilities/jwtUtils.jsx';

export const checkStatus = async () => {
    await checkUserStatus();
};

// Función para verificar el estado del usuario en el servidor
export const checkUserStatus = async () => {
    const token = localStorage.getItem('jwt'); // Obtener el token del localStorage

    // Si no hay token, desloguear inmediatamente
    if (!token) {
        logoutAndRedirect();
        return;
    }

    const idUsuario = getIdUsuario(token); // Extraer el ID del usuario desde el token

    try {
        const response = await fetch(`${API_BASE_URL}/api/check-status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Enviar el token en el header
            },
            body: JSON.stringify({ idUsuario })
        });

        if (response.ok) {
            const data = await response.json();

            if (data.status === 'loggedOff') {
                // Si el servidor dice 'loggedOff' o el token ha expirado, desloguear
                logoutAndRedirect();
            } else if (data.status === 'loggedOn') {
                // Si el servidor dice 'loggedOn' pero el token está expirado, también desloguear
                if (isTokenExpired(token)) {
                    logoutAndRedirect();
                }
                // Si está loggedOn y el token no está expirado, no hacer nada
            }
        } else {
            // Si hay un error en la respuesta del servidor, desloguear
            logoutAndRedirect();
        }
    } catch (error) {
        // Si ocurre un error en la solicitud, desloguear
        logoutAndRedirect();
    }
};
