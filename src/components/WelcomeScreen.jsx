import React from 'react';

const WelcomeScreen = () => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-6xl font-bold text-white animate-fade-in-up animate-delay-100">
        MELYMARCKSTORE
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mt-4 animate-fade-in-up animate-delay-300">
        Tu estilo, nuestra pasión.
      </p>
    </div>
  );
};

export default WelcomeScreen;