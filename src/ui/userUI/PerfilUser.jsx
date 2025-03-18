import React, { useEffect, useState, useRef } from 'react';
import { getIdUsuario } from '../../utilities/jwtUtils';
import LoadingScreen from '../../components/home/LoadingScreen';
import { verificarYRenovarToken } from '../../js/authToken';
import API_BASE_URL from '../../js/urlHelper';
import SweetAlert from '../../components/SweetAlert';
import jwtUtils from '../../utilities/jwtUtils';

function Perfil() {
  const [perfilData, setPerfilData] = useState({
    username: '',
    nombres: '',
    apellidos: '',
    dni: '',
    correo: '',
    edad: '',
    nacimiento: '',
    sexo: '',
    direccion: '',
    telefono: '',
    perfil: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDniValid, setIsDniValid] = useState(true);
  const [dniValidationData, setDniValidationData] = useState(null);
  const [showDniNote, setShowDniNote] = useState(false);
  const [isDniLocked, setIsDniLocked] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  
  const fileInputRef = useRef(null);
  const token = jwtUtils.getTokenFromCookie();
  const idUsuario = getIdUsuario(token);
  const perfilRef = useRef(null);
  
  const sexos = ['Masculino', 'Femenino'];

  // Efecto principal para cargar los datos del perfil
  useEffect(() => {
    if (token) {
      setIsLoading(true);
      verificarYRenovarToken();
      fetch(`${API_BASE_URL}/api/perfilCliente`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setPerfilData(data.data);
          // Si hay un DNI existente, simplemente bloquearlo sin revalidar
          if (data.data.dni && data.data.dni.length === 8) {
            setIsDniLocked(true);
            setIsDniValid(true);
          }
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error al obtener los datos del perfil:", error);
          setIsLoading(false);
        });
    }
  }, [token]);

  const validateDNI = async (dni, skipNotifications = false) => {
    if (dni.length !== 8) {
      SweetAlert.showMessageAlert('Error', 'El DNI debe tener 8 dígitos.', 'error'); 
      return;
    }

    // Si el DNI ya está validado y bloqueado, no realizar la validación
    if (isDniLocked) return;

    setIsLoading(true);
    await verificarYRenovarToken();
    try {
      const response = await fetch(`${API_BASE_URL}/api/validate-dni/${dni}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsDniValid(true);
        setIsDniLocked(true);
        if (!skipNotifications) {
          SweetAlert.showMessageAlert('Exito', 'DNI validado correctamente, guarda los cambios.', 'success'); 
        }
      } else {
        setIsDniValid(false);
        if (!skipNotifications) {
          SweetAlert.showMessageAlert('Error', 'DNI no válido o no encontrado.', 'error'); 
        }
      }
    } catch (error) {
      console.error('Error al validar el DNI:', error);
      setIsDniValid(false);
      SweetAlert.showMessageAlert('Error', 'Error al validar el DNI.', 'error'); 
    }

    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'dni') {
      // Si el DNI está bloqueado, no permitir cambios
      if (isDniLocked) return;
      
      // Validar que solo se ingresen números y máximo 8 dígitos
      const dniValue = value.replace(/\D/g, '').slice(0, 8);
      setPerfilData(prev => ({ ...prev, [name]: dniValue }));
      if (dniValue.length === 8) {
        validateDNI(dniValue, false);
      }
    } else if (name === 'nacimiento') {
      const birthDate = new Date(value);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      setPerfilData(prev => ({
        ...prev,
        [name]: value,
        edad: age,
      }));
    } else {
      setPerfilData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEdit = () => {
    // Asegurar que el DNI permanezca bloqueado si ya existe
    if (perfilData.dni && perfilData.dni.length === 8) {
      setIsDniLocked(true);
    }
    setIsEditing(true);
  };

  useEffect(() => {
    // Desactivar el modo de edición si el clic es fuera del contenedor de perfil
    const handleClickOutside = (e) => {
      if (perfilRef.current && !perfilRef.current.contains(e.target)) {
        setIsEditing(false);
      }
    };

    // Agregar el evento de clic al documento
    document.addEventListener('click', handleClickOutside);

    // Limpiar el evento cuando el componente se desmonte
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSave = () => {
    setIsLoading(true); // Activar la pantalla de carga
    verificarYRenovarToken();
    fetch(`${API_BASE_URL}/api/updateCliente/${idUsuario}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(perfilData),
    })
      .then(response => response.json())
      .then(() => {
        setIsEditing(false);
        SweetAlert.showMessageAlert('Exito!', 'Perfil actualizado exitosamente.', 'success'); 
        setIsLoading(false); // Desactivar la pantalla de carga
      })
      .catch(error => {
        console.error("Error al actualizar el perfil:", error);
        SweetAlert.showMessageAlert('Error', 'Error al actualizar el perfil.', 'error'); 
        setIsLoading(false); // Desactivar la pantalla de carga
      });
  };
  
  // Nueva función para manejar el clic en la imagen de perfil
  const handleProfileClick = () => {
    if (isEditing) {
      // Activar el input de archivo oculto
      fileInputRef.current.click();
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Subir la imagen automáticamente cuando se selecciona
      uploadProfileImage(file);
    }
  };

  const uploadProfileImage = (file) => {
    if (file) {
      const formData = new FormData();
      formData.append('perfil', file);
      verificarYRenovarToken();
      setIsLoading(true);
      
      fetch(`${API_BASE_URL}/api/uploadProfileImageCliente/${idUsuario}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then(response => response.json())
        .then(() => {
          SweetAlert.showMessageAlert('Exito!', 'Foto de perfil actualizada exitosamente.', 'success');
          
          // Obtener nuevamente los datos del perfil para actualizar la foto
          fetch(`${API_BASE_URL}/api/perfilCliente`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(response => response.json())
            .then(data => {
              setPerfilData(data.data);
              setIsLoading(false);
            })
            .catch(error => {
              console.error("Error al obtener los datos del perfil:", error);
              setIsLoading(false);
            });
        })
        .catch(error => {
          console.error("Error al subir la foto de perfil:", error);
          SweetAlert.showMessageAlert('Error', 'Error al actualizar la foto de perfil.', 'error');
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans p--20 text-gray-200">
      {/* Pantalla de carga */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      <div className="flex flex-grow justify-center items-start py-1 px-4">
        <div
          ref={perfilRef}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl flex flex-col items-center"
          style={{ minHeight: '650px' }}
        >
          {/* Foto de perfil con opción de cambio al pasar el mouse */}
          <div 
            className="flex justify-center items-center mb-6 relative"
            onMouseEnter={() => isEditing && setIsHoveringImage(true)}
            onMouseLeave={() => setIsHoveringImage(false)}
            onClick={handleProfileClick}
            style={{ cursor: isEditing ? 'pointer' : 'default' }}
          >
            <img
              src={perfilData.perfil}
              alt="Foto de perfil"
              className="rounded-full object-cover shadow-md"
              style={{
                width: '160px',
                height: '160px',
                backgroundColor: '#f0f0f0',
                transition: 'opacity 0.3s',
                opacity: isHoveringImage && isEditing ? '0.7' : '1'
              }}
              loading="eager"
            />
            
            {/* Icono para cambiar foto cuando se pasa el mouse */}
            {isEditing && isHoveringImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="48" 
                  height="48" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-white"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
            )}
            
            {/* Input oculto para subir la foto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Información del usuario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
            {[
              { label: 'Nombre', name: 'nombres' },
              { label: 'Apellidos', name: 'apellidos' },
              {
                label: 'DNI',
                name: 'dni',
                className: `border ${
                  isEditing && !isDniLocked
                    ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    : 'bg-gray-100'
                } ${
                  !isDniValid && isEditing ? 'border-red-500' : ''
                } text-gray-900 p-2 rounded-md`,
              },
            ].map(({ label, name, className }) => (
              <div key={name} className="flex flex-col space-y-2 relative">
                <label className="font-semibold text-gray-700">
                  {label}
                  {name === 'dni' && isDniLocked && (
                    <span className="ml-2 text-sm text-gray-500">(Bloqueado)</span>
                  )}
                </label>
                <input
                  type="text"
                  name={name}
                  value={perfilData[name] || ''}
                  onChange={handleChange}
                  disabled={name !== 'dni' ? !isEditing : isDniLocked}
                  onFocus={() => {
                    if (name === 'dni' && !isDniLocked) {
                      setShowDniNote(true);
                    }
                  }}
                  onBlur={() => {
                    if (name === 'dni') {
                      setTimeout(() => setShowDniNote(false), 200);
                    }
                  }}
                  className={className || `border ${
                    isEditing
                      ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      : 'bg-gray-100'
                  } text-gray-900 p-2 rounded-md`}
                />
                {name === 'dni' && showDniNote && !isDniLocked && (
                  <div className="absolute -bottom-6 left-0 bg-yellow-100 text-yellow-800 text-xs p-1 rounded shadow-sm z-10">
                    Ingresa tu DNI verdadero. Una vez validado, será bloqueado el campo.
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Fila de 3 elementos: Correo, Edad, Fecha de nacimiento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
            {[{ label: 'Correo', name: 'correo', type: 'email' }].map(({ label, name, type = 'text' }) => (
              <div key={name} className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={perfilData[name] || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`border ${
                    isEditing ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' : 'bg-gray-100'
                  } text-gray-900 p-2 rounded-md`}
                />
              </div>
            ))}
            {/* Edad (no editable) */}
            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700">Edad</label>
              <input
                type="number"
                name="edad"
                value={perfilData.edad || ''}
                disabled
                className="border bg-gray-100 text-gray-900 p-2 rounded-md"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-semibold text-gray-700">Fecha de Nacimiento</label>
              <input
                type="date"
                name="nacimiento"
                value={perfilData.nacimiento || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className={`border ${
                  isEditing ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' : 'bg-gray-100'
                } text-gray-900 p-2 rounded-md`}
              />
            </div>
          </div>

          {/* Fila de 1 elemento: Sexo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-6 justify-center items-center">
            <div className="flex flex-col space-y-2 ml-auto">
              <label className="font-semibold text-gray-700">Sexo</label>
              <select
                name="sexo"
                value={perfilData.sexo || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className={`border ${
                  isEditing ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' : 'bg-gray-100'
                } text-gray-900 p-2 rounded-md w-full sm:w-auto`}
              >
                {sexos.map((sexo) => (
                  <option key={sexo} value={sexo}>
                    {sexo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones para editar y guardar */}
          <div className="flex justify-center md:justify-start space-x-4">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-600"
              >
                Editar
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-600"
              >
                Guardar Cambios
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;