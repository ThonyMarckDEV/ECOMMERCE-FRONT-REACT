import React, { useEffect, useState, useRef } from 'react';
import { getIdUsuario } from '../../utilities/jwtUtils'; // Importamos getIdUsuario
import LoadingScreen from '../../components/home/LoadingScreen'; // Importamos el componente LoadingScreen
import Notification from '../../components/home/Notificacion'; // Importamos el componente de notificación
//Js scripts
import { verificarYRenovarToken } from '../../js/authToken';
import API_BASE_URL from '../../js/urlHelper';

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
    departamento: '',
    perfil: '' // Foto de perfil
  });
  const [isEditing, setIsEditing] = useState(false); // Controla si estamos en modo edición
  const [notification, setNotification] = useState(null); // Estado para manejar la notificación
  const [isLoading, setIsLoading] = useState(false); // Controlar la pantalla de carga
  const [newProfileImage, setNewProfileImage] = useState(null); // Estado para manejar la nueva imagen

  const token = localStorage.getItem('jwt'); // Obtener el token desde localStorage
  const idUsuario = getIdUsuario(token); // Obtener el ID del usuario desde el token
  const perfilRef = useRef(null); // Referencia al contenedor del perfil

  const departamentos = [
    'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca', 'Callao', 'Cusco',
    'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad', 'Lambayeque', 'Lima', 'Loreto', 
    'Madre de Dios', 'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
  ];
  const sexos = ['Masculino', 'Femenino']; // Opciones de sexo

  useEffect(() => {
    if (token) {
      setIsLoading(true); // Activar la pantalla de carga
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
          setIsLoading(false); // Desactivar la pantalla de carga
        })
        .catch(error => {
          console.error("Error al obtener los datos del perfil:", error);
          setIsLoading(false); // Desactivar la pantalla de carga
        });
    }
  }, [token]);

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

  const handleEdit = () => {
    setIsEditing(true);
  };

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
        setNotification({
          description: 'Perfil actualizado exitosamente',
          bgColor: 'bg-green-400', // Notificación de éxito
        });
        setIsLoading(false); // Desactivar la pantalla de carga
  
        // Limpiar la notificación después de 3 segundos
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      })
      .catch(error => {
        console.error("Error al actualizar el perfil:", error);
        setNotification({
          description: 'Error al actualizar el perfil',
          bgColor: 'bg-red-400', // Notificación de error
        });
        setIsLoading(false); // Desactivar la pantalla de carga
  
        // Limpiar la notificación después de 3 segundos
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      });
  };
  

  const handleProfileImageChange = (e) => {
    setNewProfileImage(e.target.files[0]); // Guardamos la imagen seleccionada
  };

  const handleProfileImageUpload = () => {
    if (newProfileImage) {
      const formData = new FormData();
      formData.append('perfil', newProfileImage); // Asegúrate de que el nombre del campo sea 'perfil'
      verificarYRenovarToken();
      setIsLoading(true); // Activar la pantalla de carga
      fetch(`${API_BASE_URL}/api/uploadProfileImageCliente/${idUsuario}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then(response => response.json())
        .then(() => {
          setNotification({
            description: 'Foto de perfil actualizada exitosamente',
            bgColor: 'bg-green-400', // Notificación de éxito
          });
          // Desactivar el modo de edición después de la subida de la foto
          setIsEditing(false);
  
          // Limpiar la notificación después de 3 segundos
          setTimeout(() => {
            setNotification(null);
          }, 3000);
  
          // Obtener nuevamente los datos del perfil para actualizar la foto
          fetch(`${API_BASE_URL}/api/perfilCliente`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(response => response.json())
            .then(data => {
              setPerfilData(data.data); // Actualizar los datos del perfil
              setIsLoading(false);
            })
            .catch(error => {
              console.error("Error al obtener los datos del perfil:", error);
              setIsLoading(false);
            });
        })
        .catch(error => {
          console.error("Error al subir la foto de perfil:", error);
          setNotification({
            description: 'Error al actualizar la foto de perfil',
            bgColor: 'bg-red-400', // Notificación de error
          });
          setIsLoading(false);
  
          // Limpiar la notificación después de 3 segundos
          setTimeout(() => {
            setNotification(null);
          }, 3000);
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si el campo modificado es 'nacimiento', calculamos la edad
    if (name === 'nacimiento') {
      const birthDate = new Date(value);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      setPerfilData((prevData) => ({
        ...prevData,
        [name]: value,
        edad: age, // Establecer la edad calculada
      }));
    } else {
      setPerfilData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-200">
    
      {/* Pantalla de carga */}
      {isLoading && <LoadingScreen />}
    
      {/* Notificación */}
      {notification && (
        <Notification description={notification.description} bgColor={notification.bgColor} />
      )}
    
      <div className="flex flex-grow justify-center items-start py-4 px-4"> {/* Ajusté el padding superior */}
        <div
          ref={perfilRef}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl flex flex-col items-center"
          style={{ minHeight: '650px' }} 
        >
          {/* Foto de perfil */}
          <div className="flex justify-center items-center mb-6">
            <img
              src={perfilData.perfil || '/path/to/default-avatar.jpg'}
              alt="Foto de perfil"
              className="rounded-full object-cover shadow-md"
              style={{
                width: '160px', // Dimensiones fijas
                height: '160px',
                backgroundColor: '#f0f0f0', // Fondo para evitar bordes visibles
              }}
              loading="eager"
            />
          </div>
    
          {/* Información del usuario */}
          <div className="w-full">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">{perfilData.username}</h2>
    
            {/* Fila de 3 elementos no editables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
              {[{ label: 'Nombre', name: 'nombres' }, { label: 'Apellidos', name: 'apellidos' }, { label: 'DNI', name: 'dni' }].map(({ label, name }) => (
                <div key={name} className="flex flex-col space-y-2">
                  <label className="font-semibold text-gray-700">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={perfilData[name] || ''}
                    disabled
                    className="border bg-gray-100 text-gray-900 p-2 rounded-md"
                  />
                </div>
              ))}
            </div>
    
             {/* Fila de 3 elementos: Correo, Edad,Fecha de nacimiento */}
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
                    className={`border ${isEditing ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' : 'bg-gray-100'} text-gray-900 p-2 rounded-md`}
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
                  className={`border ${isEditing ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' : 'bg-gray-100'} text-gray-900 p-2 rounded-md`}
                />
              </div>
            </div>
    
            {/* Fila de 2 elementos: Sexo y Departamento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700">Sexo</label>
                <select
                  name="sexo"
                  value={perfilData.sexo || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`border ${isEditing ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' : 'bg-gray-100'} text-gray-900 p-2 rounded-md`}
                >
                  {sexos.map((sexo) => (
                    <option key={sexo} value={sexo}>
                      {sexo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-semibold text-gray-700">Departamento</label>
                <select
                  name="departamento"
                  value={perfilData.departamento || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`border ${isEditing ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' : 'bg-gray-100'} text-gray-900 p-2 rounded-md`}
                >
                  {departamentos.map((departamento) => (
                    <option key={departamento} value={departamento}>
                      {departamento}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Campo para seleccionar la nueva foto de perfil */}
            {isEditing && (
              <div className="flex flex-col space-y-2 mb-6">
                <label className="font-semibold text-gray-700">Foto de perfil</label>
                <input
                  type="file"
                  onChange={handleProfileImageChange}
                  className="text-gray-800"
                />
              </div>
            )}
    
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
                <>
                  <button
                    onClick={handleSave}
                    className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-600"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={handleProfileImageUpload}
                    className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-800"
                  >
                    Actualizar Foto
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
export default Perfil;








