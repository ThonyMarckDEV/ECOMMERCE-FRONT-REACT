import React, { useState } from 'react';
import { X, Pencil, Package, Plus, Trash2 } from 'lucide-react';
import EditarModelo from './EditarModelo';
import NuevoModelo from '../../components/superAdminComponents/Nuevomodelo';
import API_BASE_URL from '../../js/urlHelper';
import jwtUtils from '../../utilities/jwtUtils';
import SweetAlert from '../../components/SweetAlert';
import LoadingScreen from '../../components/home/LoadingScreen';
import Swal from 'sweetalert2';

const ProductoEditarModal = ({ producto, onClose }) => {
  const [modelos, setModelos] = useState(producto?.modelos || []);
  const [selectedModelo, setSelectedModelo] = useState(null);
  const [showNuevoModelo, setShowNuevoModelo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!producto) return null;

  const handleModeloClose = () => {
    setSelectedModelo(null);
  };

  const handleNuevoModeloClose = () => {
    setShowNuevoModelo(false);
  };

  const handleModeloCreated = (nuevoModelo) => {
    setModelos([...modelos, nuevoModelo]);
    setShowNuevoModelo(false);
  };

  const handleDeleteModelo = async (idModelo) => {
    const result = await Swal.fire({
      title: '¿Eliminar modelo?',
      text: '¿Estás seguro que deseas eliminar este modelo? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      const token = jwtUtils.getTokenFromCookie();
      try {
        const response = await fetch(`${API_BASE_URL}/api/EliminarModelo/${idModelo}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el modelo');
        }

        // Update the local state by removing the deleted modelo
        setModelos(modelos.filter(modelo => modelo.idModelo !== idModelo));
        SweetAlert.showMessageAlert('¡Éxito!', 'Modelo eliminado exitosamente', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error('Error:', error);
        SweetAlert.showMessageAlert('Error', 'Hubo un error al eliminar el modelo', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        {isLoading && <LoadingScreen />}
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b p-4 flex items-center justify-between bg-yellow-500">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-white" />
              <h2 className="text-xl font-semibold text-white">
                {producto?.nombreProducto}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-blue-700 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Product Details */}
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Descripción</h3>
                <p className="text-gray-700">{producto?.descripcion}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {producto?.nombreCategoria}
                </span>
              </div>
            </div>

            {/* Models Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Modelos</h3>
                <button
                  onClick={() => setShowNuevoModelo(true)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nuevo Modelo
                </button>
              </div>

              {/* Modified Models Section with Delete Button */}
              <div className="border rounded-md p-4 overflow-y-auto max-h-[300px]">
                <div className="space-y-2">
                  {modelos.map((modelo) => (
                    <div
                      key={modelo.idModelo}
                      className={`p-4 rounded-lg border transition-all cursor-pointer
                        ${selectedModelo?.idModelo === modelo.idModelo
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">
                          {modelo.nombreModelo}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            className="px-3 py-1 text-sm text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50 rounded-md transition-colors flex items-center gap-2"
                            onClick={() => setSelectedModelo(modelo)}
                          >
                            <Pencil className="h-4 w-4" />
                            Editar
                          </button>
                          <button
                            className="px-3 py-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
                            onClick={() => handleDeleteModelo(modelo.idModelo)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-6 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700"
              >
                <X className="h-4 w-4" />
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EditarModelo Modal */}
      {selectedModelo && (
        <EditarModelo 
          modelo={selectedModelo} 
          onClose={handleModeloClose}
        />
      )}

      {/* NuevoModelo Modal */}
      {showNuevoModelo && (
        <NuevoModelo
          idProducto={producto.idProducto}
          onClose={handleNuevoModeloClose}
          onModeloCreated={handleModeloCreated}
        />
      )}
    </>
  );
};

export default ProductoEditarModal;