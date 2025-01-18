import API_BASE_URL from './urlHelper.js';
import { verificarYRenovarToken } from './authToken.js';
import { jwtDecode } from 'jwt-decode';
import { checkUserStatus } from './checkUserStatus';
import { logout } from './logout'; // Cambiar a importación nombrada
import jwtUtils from '../utilities/jwtUtils.jsx';


export async function updateLastActivity() {
    try {
        // Verificar y renovar el token
        await verificarYRenovarToken();
        const token = jwtUtils.getTokenFromCookie();
        if (!token) {
            console.error('No token found. Logging out...');
            logout();
            return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.idUsuario;

        // Enviar solicitud para actualizar actividad
        const response = await fetch(`${API_BASE_URL}/api/update-activity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ idUsuario: userId })
        });

        if (response.ok) {
            console.log('Last activity successfully updated.');
        } else {
            console.warn('Failed to update last activity.');
        }
    } catch (error) {
        console.error('Error updating last activity:', error);
    } finally {
        // Verificar el estado del usuario
         await checkUserStatus();
    }
}
