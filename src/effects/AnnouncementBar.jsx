import React from 'react';

const AnnouncementBar = () => {
  return (
    <div className="bg-red-600 overflow-hidden">
      <div className="whitespace-nowrap py-2 animate-marquee">
        <span className="text-yellow-300 font-bold text-lg mx-10">
          🎉       Feliz Año Nuevo 2025!        🎉
        </span>
        <span className="text-yellow-300 font-bold text-lg mx-10">
          🎄   Promoción Navideña - 30% de descuento!    🎄
        </span>
        <span className="text-yellow-300 font-bold text-lg mx-10">
          🎁    Envíos gratis hasta el 6 de enero!    🎁
        </span>
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