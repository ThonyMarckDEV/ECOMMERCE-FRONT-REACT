import React, { useState, useEffect } from 'react';
import NavBarHome from '../../components/home/NavBarHome';
import LoadingScreen from '../../components/home/LoadingScreen';  // Importa el componente LoadingScreen
import Notification from '../../components/home/Notificacion';
import { verificarYRenovarToken } from '../../js/authToken';
import API_BASE_URL from '../../js/urlHelper';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet'; // Importamos Leaflet
import 'leaflet/dist/leaflet.css';

function AgregarDirecciones() {
  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);
  const [formData, setFormData] = useState({
    region: '',
    provincia: '',
    direccion: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

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
          setNotification({
            description: 'No se pudo obtener la ubicación.',
            bgColor: 'bg-yellow-500'
          });
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

      setNotification({
        description: 'Dirección agregada exitosamente',
        bgColor: 'bg-green-500'
      });

      setLoading(false);  // Desactivar el loading después de agregar la dirección
      resetForm();
    } catch (error) {
      setNotification({
        description: 'Error al agregar dirección',
        bgColor: 'bg-red-500'
      });
      setLoading(false);  // Desactivar el loading en caso de error
    }
  };

  const resetForm = () => {
    setFormData({
      region: '',
      provincia: '',
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
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans text-gray-800">
      <NavBarHome />

      <div className="flex-1 p-6 sm:p-8 md:p-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Detalles de la Dirección</h2>

          {notification && (
            <div className={`px-4 py-2 text-white font-semibold text-center ${notification.bgColor} rounded-md shadow-md mb-4`}>
              {notification.description}
            </div>
          )}

          {/* Mostrar loader mientras cargamos la información */}
          {loading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-opacity-50 bg-gray-700">
              <LoadingScreen />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div>
              <label className="block text-gray-700 text-sm">Región:</label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm">Provincia:</label>
              <input
                type="text"
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm">Dirección:</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="my-8 z-10 relative">
              <MapContainer
                center={latitud ? [latitud, longitud] : [-12.04318, -77.02824]}
                zoom={13}
                style={{ height: '350px', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Map latitud={latitud} longitud={longitud} setLatitud={setLatitud} setLongitud={setLongitud} />
              </MapContainer>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Agregar Dirección'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgregarDirecciones;
