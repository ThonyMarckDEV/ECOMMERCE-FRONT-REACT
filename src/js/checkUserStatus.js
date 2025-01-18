import API_BASE_URL from './urlHelper.js';
import { logout as logoutAndRedirect } from './logout.js';
import jwtUtils from '../utilities/jwtUtils.jsx';

export const checkUserStatus = async () => {
    try {
        const token = jwtUtils.getTokenFromCookie();

        if (!token) {
            console.warn('No hay token en las cookies');
            await logoutAndRedirect();
            return;
        }

        const idUsuario = jwtUtils.getIdUsuario(token);
        
        if (!idUsuario) {
            console.warn('No se pudo obtener el ID de usuario del token');
            await logoutAndRedirect();
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/check-status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ idUsuario })
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Respuesta no válida del servidor");
        }

        const data = await response.json();

        if (!response.ok || data.status === 'error' || data.force_logout) {
            console.warn('Sesión inválida:', data.message);
            await logoutAndRedirect();
            return;
        }

    } catch (error) {
        console.error('Error en checkUserStatus:', error);
        if (!(error instanceof TypeError)) {
            await logoutAndRedirect();
        }
    }
};
