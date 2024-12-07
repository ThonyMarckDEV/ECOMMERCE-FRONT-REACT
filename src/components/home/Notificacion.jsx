// src/components/Notification.jsx

import React, { useState } from 'react';

const Notification = ({ description, bgColor }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 mx-auto p-2 z-50 ${bgColor} text-white text-center font-bold`}
      style={{ maxWidth: '500px', width: '100%', borderRadius: '8px', marginTop: '10px' }}
    >
      <div className="flex justify-center items-center">
        <span>{description}</span>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 bg-transparent text-white font-bold text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;
