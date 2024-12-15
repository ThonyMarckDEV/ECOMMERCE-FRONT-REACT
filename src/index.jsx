// import React from 'react';
// //import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
// import ReactDOM from 'react-dom'; // Cambia esta línea
// import App from './App';

// const root = ReactDOM.createRoot(document.getElementById('root')); // Create the root
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom'; // Importación normal
import App from './App';

// Con React 17 usa render() en lugar de createRoot()
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
