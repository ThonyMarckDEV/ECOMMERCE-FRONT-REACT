import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const FireworksEffect = () => {
  const [fireworks, setFireworks] = useState([]);
  const containerRef = useRef(null);

  const createFirework = () => {
    const colors = ['#FF3F3F', '#3FFF3F', '#3F3FFF', '#FFFF3F', '#FF3FFF', '#3FFFFF'];
    const x = Math.random() * window.innerWidth;
    const y = window.innerHeight; // Desde la parte superior

    const firework = {
      id: Date.now(),
      x,
      y,
      color: '#FFFFFF',
      size: 4,
      particleCount: 80,
    };

    setFireworks((prev) => [...prev, firework]);

    // Animación del cohete hacia arriba
    gsap.to(`#firework-${firework.id}`, {
      y: -400,
      duration: 1.2,
      ease: 'power2.out',
      onComplete: () => explodeFirework(firework, colors),
    });
  };

  const explodeFirework = (firework, colors) => {
    const particles = Array.from({ length: firework.particleCount }).map((_, i) => {
      const angle = (i / firework.particleCount) * Math.PI * 2;
      return {
        id: `${firework.id}-${i}`,
        x: firework.x,
        y: firework.y - 400,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
        angle,
        speed: Math.random() * 100 + 50,
      };
    });

    setFireworks((prev) => prev.filter((fw) => fw.id !== firework.id).concat(particles));

    particles.forEach((particle) => {
      gsap.to(`#particle-${particle.id}`, {
        x: Math.cos(particle.angle) * particle.speed,
        y: Math.sin(particle.angle) * particle.speed,
        opacity: 0,
        duration: 2,
        ease: 'power2.out',
        onComplete: () => {
          setFireworks((prev) => prev.filter((p) => p.id !== particle.id));
        },
      });
    });
  };

  useEffect(() => {
    const interval = setInterval(createFirework, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {fireworks.map((fw) => (
        <div
          key={fw.id}
          id={`firework-${fw.id}`}
          className="absolute rounded-full"
          style={{
            backgroundColor: fw.color,
            width: `${fw.size}px`,
            height: `${fw.size}px`,
            left: `${fw.x}px`,
            top: `${fw.y}px`,
          }}
        ></div>
      ))}

      {fireworks.map((p) =>
        p.angle !== undefined ? (
          <div
            key={p.id}
            id={`particle-${p.id}`}
            className="absolute rounded-full"
            style={{
              backgroundColor: p.color,
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.x}px`,
              top: `${p.y}px`,
            }}
          ></div>
        ) : null
      )}
    </div>
  );
};

export default FireworksEffect;
