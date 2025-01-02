import React, { useEffect } from 'react';
import Fireworks from 'fireworks-js';

const FireworksEffect = () => {
  useEffect(() => {
    const container = document.getElementById('fireworks-container');

    // Crear fuegos artificiales
    const fireworks = new Fireworks(container, {
      speed: 0.0001,
      acceleration: 1,
      friction: 0.98,
      gravity: 0,
      particles: 50,
      hue: { min: 0, max: 360 },
      delay: { min: 100, max: 200 },
      lifetime: { min: 3, max: 3 },
      position: { x: window.innerWidth / 2, y: window.innerHeight },
      width: window.innerWidth,
      height: window.innerHeight,
      numberOfFireworks: 1,
    });

    fireworks.start();

    // Detener fuegos artificiales después de 3 segundos
    setTimeout(() => {
      fireworks.stop();
    }, 10000);

    // Limpiar al desmontar el componente
    return () => {
      fireworks.stop();
    };
  }, []);

  return (
    <div
      id="fireworks-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    ></div>
  );
};

export default FireworksEffect;
