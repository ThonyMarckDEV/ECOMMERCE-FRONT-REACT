import API_BASE_URL from './urlHelper.js';
import { logout as logoutAndRedirect } from './logout.js';

const checkTokenInterval = 30000; // Verificación cada 30 segundos
const checkUserStatusInterval = 5000; // Verificación de estado de usuario cada 5 segundos
const expirationThreshold = 120;   // Intento de renovación si quedan 2 minutos o menos

let isRenewingToken = false;
let intervalId;  // Intervalo para la verificación del token
let userStatusIntervalId;  // Intervalo para la verificación del estado del usuario

export const checkToken = async () => {
   // console.log("Iniciando verificación de token almacenado...");

    // Verificación inicial del token
    let token = localStorage.getItem("jwt");
    if (!token) {
       // console.log("No se encontró token en localStorage, no se ejecutará la verificación de estado.");
        return; // Si no hay token, no hacemos nada
    }

    let decodedToken = parseJwt(token);
    let rol = decodedToken.rol;
    let idUsuario = decodedToken.idUsuario;

   // console.log("Rol del usuario:", rol);
   // console.log("ID de usuario:", idUsuario);

    // Verificación del estado del usuario
    await checkUserStatus();

    // Verificación y renovación del token cada intervalo
    intervalId = setInterval(checkAndRenewToken, checkTokenInterval); // Guardamos el intervalId

    // Verificar el estado del usuario cada 5 segundos
    userStatusIntervalId = setInterval(checkUserStatus, checkUserStatusInterval); // Guardamos el intervalo del estado del usuario
}

// Llamar a esta función para limpiar los intervalos cuando sea necesario
export const clearTokenCheckInterval = () => {
    if (intervalId) {
        clearInterval(intervalId);
       //console.log("Intervalo de verificación de token limpiado.");
    }
    if (userStatusIntervalId) {
        clearInterval(userStatusIntervalId);
       // console.log("Intervalo de verificación de estado de usuario limpiado.");
    }
}

// Función para verificar el estado del usuario en el servidor
export const checkUserStatus = async () => {
   // console.log("Verificando estado del usuario con la API...");

    const token = localStorage.getItem('jwt'); // Obtén el token actualizado
    if (!token) {
        console.log("No se encontró token al verificar el estado. Redirigiendo al login...");
        //logoutAndRedirect();
        return;
    }

    const idUsuario = parseJwt(token).idUsuario; // Obtén idUsuario actualizado

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
            console.log("Respuesta de estado recibida:", data);

            if (data.status === 'loggedOff' || (data.status === 'loggedOnInvalidToken' && !data.isTokenValid)) {
                console.log("Estado del usuario/token inválido. Redirigiendo al login...");
              //  logoutAndRedirect();
            } else if (data.status === 'loggedOn' && data.isTokenValid) {
               // console.log("Estado del usuario activo y token válido.");
            }
        } else {
            console.log("Error en la respuesta al verificar el estado, redirigiendo...");
            logoutAndRedirect();
        }
    } catch (error) {
        console.error("Error en la solicitud de verificación del estado del usuario:", error);
        //logoutAndRedirect();
    }
}

// Función para parsear el token JWT
const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error al decodificar el token JWT:", error);
        return null;
    }
}

// Función para obtener la expiración del token
const parseJwtExpiration = (token) => {
    const payload = parseJwt(token);
    return payload ? payload.exp : null;
}

// Función para renovar el token si es necesario
const renewToken = async (token) => {
    if (isRenewingToken) return;
    isRenewingToken = true;

    try {
        const response = await fetch(`${API_BASE_URL}/api/refresh-token`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Token renovado");
            const nuevoToken = data.accessToken;
            localStorage.setItem('jwt', nuevoToken);
            console.log("Nuevo token almacenado en localStorage.");
        } else {
            console.log("Error al renovar el token, cerrando sesión...");
           // logoutAndRedirect();
        }
    } catch (error) {
        console.error("Excepción al renovar el token:", error);
       // logoutAndRedirect();
    } finally {
        isRenewingToken = false;
    }
}

// Función para verificar y renovar el token cuando sea necesario
const checkAndRenewToken = async () => {
    console.log("Verificando Token almacenado...");
    const token = localStorage.getItem('jwt');

    if (!token) {
        console.log("No hay token, no se puede verificar o renovar.");
        return; // Si no hay token, no hacemos nada
    }

    const tokenExpiration = parseJwtExpiration(token);
    if (!tokenExpiration) {
        console.log("No se pudo obtener la expiración del token, cerrando sesión...");
       // logoutAndRedirect();
        return;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timeRemaining = tokenExpiration - currentTime;

    if (timeRemaining <= 0) {
        alert("Tu sesión ha caducado, serás redirigido para iniciar sesión nuevamente.");
        console.log("El token ha expirado, cerrando sesión...");
         logoutAndRedirect();
    } else if (timeRemaining <= expirationThreshold) {
       // console.log(`Renovando el token, tiempo restante hasta expiración: ${timeRemaining} segundos.`);
        await renewToken(token);
    } else {
        //console.log(`No es necesario renovar aún, tiempo restante hasta expiración: ${timeRemaining} segundos.`);
    }
}
