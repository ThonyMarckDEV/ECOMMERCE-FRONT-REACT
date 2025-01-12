import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import API_BASE_URL from '../../js/urlHelper';
import jwtUtils from '../../utilities/jwtUtils';
import SweetAlert from '../../components/SweetAlert';
import LoadingScreen from '../../components/home/LoadingScreen';
import { verificarYRenovarToken } from '../../js/authToken';

const NuevoModeloAdmin = ({ idProducto, onClose, onModeloCreated }) => {
  const [nombreModelo, setNombreModelo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const token = jwtUtils.getTokenFromCookie();
    await verificarYRenovarToken();
    try {
      const response = await fetch(`${API_BASE_URL}/api/agregarModelo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          idProducto,
          nombreModelo,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear el modelo');
      }

      const data = await response.json();
      if (isMounted) {
        onModeloCreated(data); // Llama a la función para actualizar la lista de modelos
        SweetAlert.showMessageAlert('Éxito', 'Modelo Creado Exitosamente', 'success');
        onClose(); // Cierra el modal después de crear el modelo
      }
    } catch (err) {
      if (isMounted) {
        setError('Ha ocurrido un error al crear el modelo');
        SweetAlert.showMessageAlert('Error', 'Ha ocurrido un error al crear el modelo', 'error');
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      {isLoading && <LoadingScreen />}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b p-4 flex items-center justify-between bg-gray-900">
          <h2 className="text-xl font-semibold text-white">Nuevo Modelo</h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-blue-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="nombreModelo" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Modelo
            </label>
            <input
              type="text"
              id="nombreModelo"
              value={nombreModelo}
              onChange={(e) => setNombreModelo(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoModeloAdmin;