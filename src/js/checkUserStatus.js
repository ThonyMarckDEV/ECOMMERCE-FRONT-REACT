import API_BASE_URL from './urlHelper.js';
import { logout as logoutAndRedirect } from './logout.js';
import jwtUtils from '../utilities/jwtUtils.jsx';

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

            // Verificar si el token es válido según la respuesta del backend
            if (data.status === 'error' && data.message === 'Token inválido o revocado') {
                console.warn('Token blacklisted, deslogueando al usuario');
                logoutAndRedirect();  // Desloguear al usuario si el token es inválido
            } else if (data.status === 'success') {
                console.log('Token válido, usuario autenticado');
                // Aquí puedes realizar acciones adicionales si el token es válido
            }
        } else {
            // Si la respuesta no es exitosa, deslogueamos al usuario
            console.error('Error en la verificación del token');
            //logoutAndRedirect();
        }
    } catch (error) {
        // Si ocurre un error durante la solicitud, deslogueamos al usuario
        console.error('Error en checkUserStatus:', error);
        //logoutAndRedirect();  // Desloguear en caso de error
    }
};