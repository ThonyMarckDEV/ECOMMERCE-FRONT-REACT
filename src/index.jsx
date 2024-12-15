import React from 'react';
//import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import ReactDOM from 'react-dom'; // Cambia esta línea
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
