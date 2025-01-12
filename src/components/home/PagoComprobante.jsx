import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, CheckCircle } from 'lucide-react';
import API_BASE_URL from '../../js/urlHelper';
import jwtUtils from '../../utilities/jwtUtils';
import SweetAlert from '../../components/SweetAlert';

const PagoComprobante = ({ isOpen, onClose, idPedido, onSuccess }) => {
  const [selectedTab, setSelectedTab] = useState('yape');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const qrCodes = {
    yape: '/api/placeholder/200/200',
    plin: '/api/placeholder/200/200',
    bcp: '/api/placeholder/200/200'
  };

  const tabIcons = {
    yape: '/api/placeholder/24/24',
    plin: '/api/placeholder/24/24',
    bcp: '/api/placeholder/24/24'
  };

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles[0]) {
      setUploadedFile(acceptedFiles[0]);
      const fileUrl = URL.createObjectURL(acceptedFiles[0]);
      setPreviewUrl(fileUrl);
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!idPedido) {
        setError('No se encontró un ID de pedido válido.');
        return;
      }

      const formData = new FormData();
      formData.append('idPedido', idPedido);
      formData.append('comprobante', uploadedFile);
      formData.append('metodo_pago', selectedTab);

      const token = jwtUtils.getTokenFromCookie();
      if (!token) {
        setError('No se encontró un token de autenticación.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/recibirPagoComprobante`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        // Mostrar mensaje de éxito
        await SweetAlert.showMessageAlert(
          '¡Éxito!',
          'Comprobante enviado exitosamente. Tu pedido será verificado pronto.',
          'success'
        );
        
        // Llamar al callback de éxito para actualizar la lista de pedidos
        if (onSuccess) {
          onSuccess();
        }
        
        // Simular la redirección como en MercadoPago
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('status', 'approved');
        currentUrl.searchParams.set('external_reference', idPedido);
        window.history.pushState({}, '', currentUrl.toString());
        
        onClose();
      } else {
        setError(data.message || 'Error al procesar el pago');
      }
    } catch (error) {
      console.error('Error al enviar comprobante:', error);
      setError('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Pago por Comprobante
            </h2>

            <div className="w-full">
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                {['yape', 'plin', 'bcp'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
                      ${selectedTab === tab 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'}
                    `}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <img 
                        src={tabIcons[tab]} 
                        alt={`${tab} logo`}
                        className="w-6 h-6 object-contain"
                      />
                      <span>{tab.toUpperCase()}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <div className="bg-white rounded-lg border p-6 shadow-sm">
                  <div className="flex flex-col items-center space-y-4">
                    <img
                      src={qrCodes[selectedTab]}
                      alt={`Código QR ${selectedTab.toUpperCase()}`}
                      className="w-48 h-48 object-contain"
                    />
                    <p className="text-sm text-gray-600 text-center">
                      Escanea el código QR para realizar el pago con {selectedTab.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div 
              {...getRootProps()} 
              className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                transition-colors duration-200
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                ${uploadedFile ? 'bg-green-50 border-green-500' : ''}
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-4">
                {uploadedFile ? (
                  <>
                    <CheckCircle className="w-12 h-12 text-green-500" />
                    <p className="text-green-700 font-medium">
                      {uploadedFile.name}
                    </p>
                    {previewUrl && (
                      <div className="mt-4 relative w-full max-w-xs">
                        <img
                          src={previewUrl}
                          alt="Preview del comprobante"
                          className="w-full h-auto rounded-lg shadow-md"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400" />
                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">
                        Arrastra tu comprobante aquí
                      </p>
                      <p className="text-sm text-gray-500">
                        o haz clic para seleccionar
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!uploadedFile || loading}
              className={`
                w-full py-6 text-lg font-medium text-white rounded-xl
                transition-all duration-200
                ${uploadedFile && !loading
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                  : 'bg-gray-300 cursor-not-allowed'}
              `}
            >
              {loading ? 'Procesando...' : 'Confirmar Pago'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagoComprobante;