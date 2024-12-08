import API_BASE_URL from './urlHelper.js';
import { verificarYRenovarToken } from './authToken.js';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de importar jwtDecode correctamente

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

            const data = await response.json();
           // console.log('Last activity updated:', data.message);
        } catch (error) {
           // console.error('Error updating last activity:', error);
        }
    }
}
