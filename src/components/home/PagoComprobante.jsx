import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, CheckCircle } from 'lucide-react';
import API_BASE_URL from '../../js/urlHelper';
import jwtUtils from '../../utilities/jwtUtils';
import SweetAlert from '../../components/SweetAlert';
import yapeLogo from '../../img/yapelogo.png';
import plinLogo from '../../img/plinlogo.png';
import yapeQR from '../../img/yapeqr.jpg';
import plinQR from '../../img/plinqr.png';

const PagoComprobante = ({ isOpen, onClose, idPedido, total = 0, onSuccess }) => {
  const [selectedTab, setSelectedTab] = useState('yape');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsMounted(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const openImageModal = (event) => {
    event.preventDefault();
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const formatTotal = (amount) => {
    const numAmount = Number(amount);
    return !isNaN(numAmount) ? numAmount.toFixed(2) : '0.00';
  };

  const qrCodes = {
    yape: yapeQR,
    plin: plinQR,
  };

  const tabIcons = {
    yape: yapeLogo,
    plin: plinLogo,
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
        await SweetAlert.showMessageAlert(
          '¡Éxito!',
          'Comprobante enviado exitosamente. Tu pedido será verificado pronto.',
          'success'
        );
        
        if (onSuccess) {
          onSuccess();
        }
        
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('status', 'approved');
        currentUrl.searchParams.set('external_reference', idPedido);
        window.history.pushState({}, '', currentUrl.toString());
        
        handleClose();
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div
        className={`
          bg-white rounded-xl w-full max-w-4xl p-6 relative
          transition-all duration-300 ease-in-out transform
          ${isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          overflow-y-auto max-h-[90vh] md:max-h-[80vh]
        `}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Pago por Comprobante
              </h2>
              <div className="text-xl font-semibold text-black">
                Total: S/ {formatTotal(total)}
              </div>
            </div>

            <div className="w-full">
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                {['yape', 'plin'].map((tab) => (
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
                      Escanea el código QR para realizar el pago de S/ {formatTotal(total)} con {selectedTab.toUpperCase()}
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
                          className="w-24 h-24 object-cover rounded-lg shadow-md cursor-pointer"
                          onClick={openImageModal}
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

            {/* Nota de advertencia */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-yellow-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-yellow-700">
                  Por razones de seguridad, el comprobante será revisado por un administrador para proceder con su pedido. Por favor, evita suspensiones de tu cuenta adjuntando capturas falsas o imágenes no relacionadas. Gracias.
                </p>
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
                w-full py-3 md:py-4 text-lg font-medium text-white rounded-xl
                transition-all duration-200
                ${uploadedFile && !loading
                  ? 'bg-black hover:bg-gray-800'
                  : 'bg-gray-300 cursor-not-allowed'}
              `}
            >
              {loading ? 'Procesando...' : 'Confirmar Pago'}
            </button>
          </div>
        </div>
      </div>

      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-xs relative">
            <button
              onClick={closeImageModal}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <img
              src={previewUrl}
              alt="Comprobante de pago"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PagoComprobante;