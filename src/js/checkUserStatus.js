import API_BASE_URL from './urlHelper.js';
import { logout as logoutAndRedirect } from './logout.js';
import jwtUtils from '../utilities/jwtUtils.jsx';

// export const checkUserStatus = async () => {
//     const token = jwtUtils.getTokenFromCookie(); // Obtener token desde la cookie

//     if (!token || jwtUtils.isTokenExpired(token)) {
//         // Si no hay token o está expirado, deslogueamos al usuario
//         console.warn('No hay token o está expirado');
//         logoutAndRedirect();  // Aquí se debe hacer logout y redirigir
//         return;
//     }

//     const idUsuario = jwtUtils.getIdUsuario(token);

//     try {
//         // Enviar solicitud para verificar el estado y el token en la base de datos
//         const response = await fetch(`${API_BASE_URL}/api/check-status`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify({ idUsuario })
//         });

//         if (response.ok) {
//             const data = await response.json();

//             // Verificar si el token es válido según la respuesta del backend
//             if (data.status === 'error' && data.message === 'Token inválido o revocado') {
//                 console.warn('Token blacklisted, deslogueando al usuario');
//                 logoutAndRedirect();  // Desloguear al usuario si el token es inválido
//             } else if (data.status === 'success') {
//                console.log('Token válido, usuario autenticado');
//             }
//         } else {
//             // Si la respuesta no es exitosa, deslogueamos al usuario
//             console.error('Error en la verificación del token');
//             logoutAndRedirect();  // Desloguear al usuario si el token es inválido
//         }
//     } catch (error) {
//         // Si ocurre un error durante la solicitud, deslogueamos al usuario
//         console.error('Error en checkUserStatus:', error);
//         //logoutAndRedirect();  // Desloguear en caso de error
//     }
// };

// checkUserStatus.js

// checkUserStatus.js

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
