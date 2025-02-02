import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/superAdminComponents/SidebarSuperAdmin';
import API_BASE_URL from '../../js/urlHelper';
import SweetAlert from '../../components/SweetAlert';
import LoaderScreen from '../../components/home/LoadingScreen';
import jwtUtils from '../../utilities/jwtUtils';
import { verificarYRenovarToken } from '../../js/authToken';

function Configuracion() {
  const [facturacionElectronica, setFacturacionElectronica] = useState(false);
  const [metodoPago, setMetodoPago] = useState(null); // Estado para el método de pago
  const [loading, setLoading] = useState(false);

  // Obtener el estado inicial de la facturación electrónica y el método de pago
  useEffect(() => {
    const fetchConfiguracion = async () => {
      setLoading(true);
      const token = jwtUtils.getTokenFromCookie();
      await verificarYRenovarToken();
      try {
        // Obtener estado de facturación electrónica
        const responseFacturacion = await fetch(`${API_BASE_URL}/api/configuracion/facturacion-electronica`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!responseFacturacion.ok) {
          throw new Error('Error al obtener el estado de la facturación electrónica');
        }

        const dataFacturacion = await responseFacturacion.json();
        setFacturacionElectronica(dataFacturacion.activa);

        // Obtener método de pago activo
        const responseMetodoPago = await fetch(`${API_BASE_URL}/api/configuracion/metodo-pago`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!responseMetodoPago.ok) {
          throw new Error('Error al obtener el método de pago activo');
        }

        const dataMetodoPago = await responseMetodoPago.json();
        setMetodoPago(dataMetodoPago.metodo);
      } catch (error) {
        console.error('Error:', error);
        SweetAlert.showMessageAlert('Error', 'Hubo un problema al cargar la configuración.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchConfiguracion();
  }, []);

  // Cambiar el estado de la facturación electrónica
  const toggleFacturacionElectronica = async () => {
    setLoading(true);
    const token = jwtUtils.getTokenFromCookie();
    await verificarYRenovarToken();
    try {
      const response = await fetch(`${API_BASE_URL}/api/configuracion/facturacion-electronica`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ activa: !facturacionElectronica }),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar el estado de la facturación electrónica');
      }

      const data = await response.json();
      setFacturacionElectronica(data.activa);
      SweetAlert.showMessageAlert('¡Éxito!', 'El estado de la facturación electrónica se actualizó correctamente.', 'success');
    } catch (error) {
      console.error('Error:', error);
      SweetAlert.showMessageAlert('Error', 'Hubo un problema al actualizar la configuración.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Cambiar el método de pago
  const cambiarMetodoPago = async (metodo) => {
    setLoading(true);
    const token = jwtUtils.getTokenFromCookie();
    await verificarYRenovarToken();
    try {
      const response = await fetch(`${API_BASE_URL}/api/configuracion/metodo-pago`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ metodo, status: 1 }),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar el método de pago');
      }

      const data = await response.json();
      setMetodoPago(metodo);
      SweetAlert.showMessageAlert('¡Éxito!', 'El método de pago se actualizó correctamente.', 'success');
    } catch (error) {
      console.error('Error:', error);
      SweetAlert.showMessageAlert('Error', 'Hubo un problema al actualizar el método de pago.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Configuración</h1>

        {loading && <LoaderScreen />}

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Facturación Electrónica</h2>
          <div className="flex items-center justify-between">
            <p className="text-gray-700">
              {facturacionElectronica ? 'Activada' : 'Desactivada'}
            </p>
            <button
              onClick={toggleFacturacionElectronica}
              className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                facturacionElectronica ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  facturacionElectronica ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>
          <div className="flex items-center justify-between">
            <p className="text-gray-700">
              Método actual: {metodoPago === 'comprobante' ? 'Comprobante' : 'MercadoPago'}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => cambiarMetodoPago('comprobante')}
                className={`px-4 py-2 rounded-lg ${
                  metodoPago === 'comprobante' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
                }`}
              >
                Comprobante
              </button>
              <button
                onClick={() => cambiarMetodoPago('mercadopago')}
                className={`px-4 py-2 rounded-lg ${
                  metodoPago === 'mercadopago' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
                }`}
              >
                MercadoPago
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configuracion;