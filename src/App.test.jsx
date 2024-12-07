import { render, screen } from '@testing-library/react';
import React from 'react';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <Home />  // Asegúrate de que esto muestre tu componente Home
    </div>
  );
}

export default App;
