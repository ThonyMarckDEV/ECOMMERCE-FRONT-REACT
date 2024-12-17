import API_BASE_URL from './urlHelper.js';
import { verificarYRenovarToken } from './authToken.js';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de importar jwtDecode correctamente
import { checkStatus } from './js/checkUserStatus';

export async function updateLastActivity() {
    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    const token = localStorage.getItem('jwt'); // Obtener el token actualizado

    if (token) {
        const decoded = jwtDecode(token); // Usar jwtDecode aquí
        const userId = decoded.idUsuario;

        try {
            const response = await fetch(`${API_BASE_URL}/api/update-activity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ idUsuario: userId })
            });

            // Verificar si la respuesta fue exitosa
            if (response.ok) {
                const data = await response.json();
                console.log('Last activity updated:', data.message);
            } else {
                console.warn('Failed to update last activity. Response:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating last activity:', error);
        } finally {
            // Llamar a checkStatus() independientemente del resultado
            checkStatus();
        }
    } else {
        console.error('No token found in localStorage.');
        checkStatus(); // Llamar a checkStatus si no hay token
    }
}
