import API_BASE_URL from './urlHelper.js';
import { logout as logoutAndRedirect } from './logout.js';
import { getIdUsuario, isTokenExpired } from '../utilities/jwtUtils.jsx'; // Importamos la función getIdUsuario

const checkUserStatusInterval = 10000; // Verificación de estado de usuario cada 10 segundos
let userStatusIntervalId; // Declaramos la variable fuera de la función

export const checkStatus= async () => {

    // Verificación del estado del usuario
    await checkUserStatus();

    // Verificar el estado del usuario cada 5 segundos
    userStatusIntervalId = setInterval(checkUserStatus, checkUserStatusInterval); // Guardamos el intervalo del estado del usuario
}

// Función para verificar el estado del usuario en el servidor
export const checkUserStatus = async () => {

    const token = localStorage.getItem('jwt'); // Asegúrate de obtener el token de localStorage

    const idUsuario = getIdUsuario(token); // Usamos la función getIdUsuario importada

    try {
        const response = await fetch(`${API_BASE_URL}/api/check-status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Envía el token en el header
            },
            body: JSON.stringify({ idUsuario })
        });

        if (response.ok) {
            const data = await response.json();
          //  console.log("Respuesta de estado recibida:", data);

            if (data.status === 'loggedOff' || (data.status === 'loggedOnInvalidToken' && !data.isTokenValid)) {
               // console.log("Estado del usuario/token inválido. Redirigiendo al login...");
                logoutAndRedirect();
            } else if (data.status === 'loggedOn' && data.isTokenValid) {
              // console.log("Estado del usuario activo y token válido.");
            }
        } else {
           // console.log("Error en la respuesta al verificar el estado, redirigiendo...");
            logoutAndRedirect();
        }
    } catch (error) {
        //console.error("Error en la solicitud de verificación del estado del usuario:", error);
        logoutAndRedirect();
    }
}
