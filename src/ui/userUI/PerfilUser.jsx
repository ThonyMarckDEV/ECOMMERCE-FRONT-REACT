import React, { useEffect, useState, useRef } from 'react';
import NavBarHome from '../../components/home/NavBarHome';
import { getIdUsuario } from '../../utilities/jwtUtils'; // Importamos getIdUsuario
import API_BASE_URL from '../../js/urlHelper';
import LoadingScreen from '../../components/home/LoadingScreen'; // Importamos el componente LoadingScreen
import Notification from '../../components/home/Notificacion'; // Importamos el componente de notificación

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
      })
      .catch(error => {
        console.error("Error al actualizar el perfil:", error);
        setNotification({
          description: 'Error al actualizar el perfil',
          bgColor: 'bg-red-400', // Notificación de error
        });
        setIsLoading(false); // Desactivar la pantalla de carga
      });
  };

  const handleProfileImageChange = (e) => {
    setNewProfileImage(e.target.files[0]); // Guardamos la imagen seleccionada
  };

  const handleProfileImageUpload = () => {
    if (newProfileImage) {
      const formData = new FormData();
      formData.append('perfil', newProfileImage); // Asegúrate de que el nombre del campo sea 'perfil'
  
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
    <div className="flex flex-col min-h-screen bg-gray-800 font-sans text-gray-200">
      {/* Barra de navegación */}
      <NavBarHome />

      {/* Pantalla de carga */}
      {isLoading && <LoadingScreen />}

      {/* Notificación */}
      {notification && (
        <Notification description={notification.description} bgColor={notification.bgColor} />
      )}

      <div className="flex flex-grow justify-center items-center py-10 px-4">
        <div
          ref={perfilRef} // Asignamos la referencia al contenedor del perfil
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl flex flex-col md:flex-row items-center md:items-start"
        >
          {/* Foto de perfil */}
          <div className="flex justify-center items-center mb-6 md:mb-0 md:w-1/3">
            <img
              src={perfilData.perfil || '/path/to/default-avatar.jpg'}
              alt="Foto de perfil"
              className="w-40 h-40 rounded-full object-cover shadow-md"
            />
          </div>

          {/* Información del usuario */}
          <div className="md:ml-6 text-center md:text-left md:w-2/3">
            <h2 className="text-2xl font-bold text-gray-800">{perfilData.username}</h2>
            <div className="mt-4 text-gray-600 space-y-4">
              {/* Campos no editables */}
              {[{ label: 'Nombre', name: 'nombres' }, { label: 'Apellidos', name: 'apellidos' }, { label: 'DNI', name: 'dni' }, { label: 'Edad', name: 'edad', type: 'number' }].map(({ label, name, type = 'text' }) => (
                <div key={name} className="flex justify-between items-center">
                  <span className="font-semibold">{label}:</span>
                  <span>{perfilData[name] || ''}</span>
                </div>
              ))}

              {/* Campos editables */}
              {[{ label: 'Correo', name: 'correo', type: 'email' }, { label: 'Dirección', name: 'direccion' }, { label: 'Teléfono', name: 'telefono' }, { label: 'Nacimiento', name: 'nacimiento', type: 'date' }].map(({ label, name, type = 'text' }) => (
                <div key={name} className="flex justify-between items-center">
                  <span className="font-semibold">{label}:</span>
                  {isEditing ? (
                    <input
                      type={type}
                      name={name}
                      value={perfilData[name] || ''}
                      onChange={handleChange}
                      className="text-gray-800 border-b focus:outline-none w-full"
                    />
                  ) : (
                    <span>{perfilData[name] || ''}</span>
                  )}
                </div>
              ))}

              {/* Campos select */}
              <div className="flex justify-between items-center">
                <span className="font-semibold">Sexo:</span>
                {isEditing ? (
                  <select
                    name="sexo"
                    value={perfilData.sexo || ''}
                    onChange={handleChange}
                    className="text-gray-800 border-b focus:outline-none w-full"
                  >
                    {sexos.map((sexo, index) => (
                      <option key={index} value={sexo}>
                        {sexo}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{perfilData.sexo || ''}</span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold">Departamento:</span>
                {isEditing ? (
                  <select
                    name="departamento"
                    value={perfilData.departamento || ''}
                    onChange={handleChange}
                    className="text-gray-800 border-b focus:outline-none w-full"
                  >
                    {departamentos.map((departamento, index) => (
                      <option key={index} value={departamento}>
                        {departamento}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{perfilData.departamento || ''}</span>
                )}
              </div>

              {/* Campo para seleccionar la nueva foto de perfil */}
              {isEditing && (
                <div className="flex justify-between items-center mt-4">
                  <span className="font-semibold">Foto de perfil:</span>
                  <input
                    type="file"
                    onChange={handleProfileImageChange}
                    className="text-gray-800"
                  />
                </div>
              )}

              {/* Botones para editar y guardar */}
              <div className="flex justify-center md:justify-start mt-6 space-x-4">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                  >
                    Editar
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
                    >
                      Guardar Cambios
                    </button>
                    <button
                      onClick={handleProfileImageUpload}
                      className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600"
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
    </div>
  );
}

export default Perfil;
