import React, { useEffect } from 'react';
import Fireworks from 'fireworks-js';

const FireworksEffect = () => {
  useEffect(() => {
    const container = document.getElementById('fireworks-container');

    // Crear los fuegos artificiales
    const fireworks = new Fireworks(container, {
      speed: 0.0001,  // Velocidad extremadamente baja para que suban muy lentamente
      acceleration: 1.01,  // Aceleración muy suave para movimiento controlado
      friction: 0.98,  // Fricción suave
      gravity: 0,  // Sin gravedad para que no caigan
      particles: 50,  // Menos partículas por explosión
      hue: { min: 0, max: 360 },  // Colores variados para los fuegos
      delay: { min: 100, max: 100 },  // Mucho mayor tiempo de espera entre explosiones
      lifetime: { min: 3, max: 5 },  // Duración más larga de los fuegos
      position: { x: window.innerWidth / 2, y: window.innerHeight },  // Inicio desde la parte inferior
      width: window.innerWidth, // Ancho de la pantalla
      height: window.innerHeight, // Alto de la pantalla
      numberOfFireworks: 1,  // Solo 1 fuego lanzado por vez
    });

    fireworks.start();

    // Limpiar al desmontar
    return () => {
      fireworks.stop();
    };
  }, []);

  return (
    <div
      id="fireworks-container"
      style={{
        position: 'fixed',  // Fijo para que no se muevan al hacer scroll
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Para que no interfiera con otros elementos
        zIndex: 9999,  // Asegura que esté encima de otros elementos
      }}
    ></div>
  );
};

export default FireworksEffect;
