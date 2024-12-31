import React, { useState, useEffect } from 'react';
//import NavBarHome from '../../components/home/NavBarHome';
import LoadingScreen from '../../components/home/LoadingScreen';  // Importa el componente LoadingScreen
import { verificarYRenovarToken } from '../../js/authToken';
import API_BASE_URL from '../../js/urlHelper';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet'; // Importamos Leaflet
import 'leaflet/dist/leaflet.css';
import SweetAlert from '../../components/SweetAlert';

function AgregarDirecciones() {
  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);
  const [formData, setFormData] = useState({
    region: '',
    provincia: '',
    direccion: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Obtener la ubicación del usuario al cargar la página
    if (navigator.geolocation) {
      setLoading(true);  // Activar el loading mientras obtenemos la geolocalización
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitud(latitude);
          setLongitud(longitude);
          setLoading(false);  // Desactivar el loading después de obtener la ubicación
        },
        (error) => {
          console.error("Error al obtener la geolocalización: ", error);
          SweetAlert.showMessageAlert('Error', 'No se pudo obtener la ubicación.', 'error'); 
          setLoading(false);  // Desactivar el loading en caso de error
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Activar el loading mientras se envían los datos

    const token = localStorage.getItem("jwt");
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decodificando el JWT

    // Verificar que idUsuario esté presente
    if (!decoded || !decoded.idUsuario) {
      console.error("No se pudo obtener el ID del usuario desde el token");
      alert("No se pudo obtener el ID del usuario desde el token. Inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    const idUsuario = decoded.idUsuario;

    const formPayload = {
      ...formData,
      latitud,
      longitud,
      idUsuario // Asegúrate de pasar el idUsuario
    };

    try {
      verificarYRenovarToken();
      const response = await fetch(`${API_BASE_URL}/api/agregarDireccion`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formPayload)
      });

      if (!response.ok) throw new Error('Error al enviar los datos');
      SweetAlert.showMessageAlert('Exito!', 'Dirección agregada exitosamente.', 'success'); 

      setLoading(false);  // Desactivar el loading después de agregar la dirección
      resetForm();
    } catch (error) {
      SweetAlert.showMessageAlert('Error', 'Error al agregar dirección.', 'error');
      setLoading(false);  // Desactivar el loading en caso de error
    }
  };

  const resetForm = () => {
    setFormData({
      departamento: '',
      provincia: '',
      distrito: '',
      direccion: ''
    });
    setLatitud(null);
    setLongitud(null);
  };

  // Componente Map con OpenStreetMap
  const Map = ({ latitud, longitud, setLatitud, setLongitud }) => {
    const map = useMap();

    useEffect(() => {
      if (latitud && longitud) {
        map.setView([latitud, longitud], 13);
      }
    }, [latitud, longitud, map]);

    const customIcon = new L.Icon({
      iconUrl: '/img/marker.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLatitud(lat);
        setLongitud(lng);
      },
    });

    return (
      <>
        {latitud !== null && longitud !== null && (
          <Marker position={[latitud, longitud]} icon={customIcon}>
            <Popup>
              <span>Latitud: {latitud}, Longitud: {longitud}</span>
            </Popup>
          </Marker>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col min-h-screen p-0 font-sans text-gray-800">
      <div className="flex-1 p-1 sm:p-2 md:p-2"> {/* Reducir el padding */}
        <div className="max-w-full sm:max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-2"> {/* Reducir el padding interno */}
          <h2 className="text-xl font-semibold mb-1 text-center text-gray-800">Detalles de la Dirección</h2> {/* Reducir el tamaño de la fuente y el margen inferior */}
  
          {/* Mostrar loader mientras cargamos la información */}
          {loading && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <LoadingScreen />
            </div>
          )}
  
          <form onSubmit={handleSubmit} className="space-y-1 relative"> {/* Reducir el espacio entre los elementos */}
            <div className="mt-0"> {/* Eliminar el margen superior */}
              <label className="block text-gray-700 text-sm">Departamento:</label>
              <select
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" // Reducir el padding
                required
              >
                <option value="" disabled>Seleccione un departamento</option>
                <option value="Amazonas">Amazonas</option>
                <option value="Áncash">Áncash</option>
                <option value="Apurímac">Apurímac</option>
                <option value="Arequipa">Arequipa</option>
                <option value="Ayacucho">Ayacucho</option>
                <option value="Cajamarca">Cajamarca</option>
                <option value="Callao">Callao</option>
                <option value="Cusco">Cusco</option>
                <option value="Huancavelica">Huancavelica</option>
                <option value="Huánuco">Huánuco</option>
                <option value="Ica">Ica</option>
                <option value="Junín">Junín</option>
                <option value="La Libertad">La Libertad</option>
                <option value="Lambayeque">Lambayeque</option>
                <option value="Lima">Lima</option>
                <option value="Loreto">Loreto</option>
                <option value="Madre de Dios">Madre de Dios</option>
                <option value="Moquegua">Moquegua</option>
                <option value="Pasco">Pasco</option>
                <option value="Piura">Piura</option>
                <option value="Puno">Puno</option>
                <option value="San Martín">San Martín</option>
                <option value="Tacna">Tacna</option>
                <option value="Tumbes">Tumbes</option>
                <option value="Ucayali">Ucayali</option>
              </select>
            </div>
  
            <div className="mt-0"> {/* Eliminar el margen superior */}
              <label className="block text-gray-700 text-sm">Provincia:</label>
              <input
                type="text"
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" // Reducir el padding
                required
              />
            </div>
  
            <div className="mt-0"> {/* Eliminar el margen superior */}
              <label className="block text-gray-700 text-sm">Distrito:</label>
              <input
                type="text"
                name="distrito"
                value={formData.distrito}
                onChange={handleChange}
                className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" // Reducir el padding
                required
              />
            </div>
  
            <div className="mt-0"> {/* Eliminar el margen superior */}
              <label className="block text-gray-700 text-sm">Dirección:</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" // Reducir el padding
                required
              />
            </div>
  
            {/* Contenedor del mapa con altura reducida */}
            <div className="my-4 z-20 relative flex flex-col h-full"> {/* Reducir el margen superior */}
              <div className="flex-grow" style={{ height: '280px' }}> {/* Reducir la altura del mapa */}
                <MapContainer
                  center={latitud ? [latitud, longitud] : [-12.04318, -77.02824]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Map latitud={latitud} longitud={longitud} setLatitud={setLatitud} setLongitud={setLongitud} />
                </MapContainer>
              </div>
  
              {/* Botón con margen superior reducido */}
              <button
                type="submit"
                className="w-full bg-black text-white p-2 rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2" // Reducir el padding y el margen
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Agregar Dirección'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );  
}

export default AgregarDirecciones;
