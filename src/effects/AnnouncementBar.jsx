import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../js/urlHelper'; // Asegúrate de importar la URL base de tu API

const AnnouncementBar = () => {
  const [ofertaActiva, setOfertaActiva] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const obtenerOfertaActiva = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ofertas/activa`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setOfertaActiva(data.data);
          } else {
            setOfertaActiva(null); // No hay oferta activa
          }
        } else {
          console.error('Error al obtener la oferta activa');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      } finally {
        setIsLoading(false);
      }
    };

    obtenerOfertaActiva();
  }, []);

  if (isLoading) {
    return null; // O puedes mostrar un spinner de carga
  }

  if (!ofertaActiva) {
    return null; // No mostrar el componente si no hay oferta activa
  }

  return (
    <div className="bg-red-600 overflow-hidden">
      <div className="whitespace-nowrap py-2 animate-marquee">
        {/* Repetir el mensaje varias veces */}
        {[...Array(5)].map((_, index) => (
          <span key={index} className="text-yellow-300 font-bold text-lg mx-10">
            🎉 {ofertaActiva.descripcion} - {ofertaActiva.porcentajeDescuento}% de descuento! 🎉
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;

// Tailwind para el efecto de desplazamiento directo en JSX
const styles = `
@layer utilities {
  @keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
  .animate-marquee {
    display: inline-block;
    animation: marquee 15s linear infinite;
  }
}`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}