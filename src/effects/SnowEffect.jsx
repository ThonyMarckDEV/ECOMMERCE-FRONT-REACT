import React from 'react';

const SnowEffect = () => {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {Array.from({ length: 100 }).map((_, index) => (
        <div
          key={index}
          className="absolute top-0 w-2 h-2 bg-white rounded-full opacity-75 animate-fall"
          style={{
            left: `${Math.random() * 100}vw`,
            animationDuration: `${Math.random() * 5 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default SnowEffect;