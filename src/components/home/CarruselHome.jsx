// Carousel.jsx
import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';

const Carousel = ({ images = [], interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0); // Clave para reiniciar la animación

  useEffect(() => {
    if (images.length === 0) return;

    const timeoutId = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setProgressKey((prevKey) => prevKey + 1); // Actualizar la clave para reiniciar la animación
    }, interval);

    return () => clearTimeout(timeoutId);
  }, [currentIndex, images.length, interval]);

  if (images.length === 0) {
    return <div className="text-center text-white">No hay imágenes disponibles</div>;
  }

  return (
    <div className="w-full h-[50rem] relative overflow-hidden -mt-1">
      {/* Imágenes del carrusel */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}

      {/* Indicador de carga con animación CSS */}
      <div className="absolute bottom-4 left-0 right-0 mx-auto w-1/2 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          key={progressKey} // Usar la clave para reiniciar la animación
          className="h-2 bg-white rounded-full animate-progress"
          style={{ animationDuration: `${interval}ms` }}
        ></div>
      </div>
    </div>
  );
};

Carousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  interval: PropTypes.number,
};

export default memo(Carousel);
