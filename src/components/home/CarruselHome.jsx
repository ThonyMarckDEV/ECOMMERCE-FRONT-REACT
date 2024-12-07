import React, { useState, useEffect } from 'react';

const Carousel = ({ images = [], interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (images.length === 0) return; // No hacer nada si no hay imágenes.

    const intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
          return 0; // Reset progress
        }
        return prevProgress + 2; // Increment progress
      });
    }, interval / 50);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [images.length, interval]);

  if (images.length === 0) {
    return <div className="text-center text-white">No hay imágenes disponibles</div>;
  }

  return (
    <div className="w-full h-[50rem] relative overflow-hidden -mt-1"> {/* Elimina el margen superior */}
      {/* Imágenes del carrusel */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Slide ${index}`}
            className="w-full h-full object-cover" // Asegura que las imágenes ocupen todo el espacio
           // loading="lazy" // Optimización de carga
          />
        </div>
      ))}

      {/* Indicador de carga */}
      <div className="absolute bottom-4 left-0 right-0 mx-auto w-1/2 h-2 bg-gray-700 rounded-full">
        <div
          className="h-2 bg-white rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Carousel;
