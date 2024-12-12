import React, { useState } from 'react';
import '../index.css';

// Componentes HOME
import NavBarHome from '../components/home/NavBarHome'; 
import Footer from '../components/home/Footer';
import ListarProductos from '../components/home/ListarProductos';
import FiltradoProductos from '../components/home/FiltradoProductos';

function Productos() {
  const [filtro, setFiltro] = useState({ texto: '', categoria: '' });

  const handleFilterChange = (nuevoFiltro) => {
    setFiltro(nuevoFiltro);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900"> {/* Fondo corregido */}

      {/* Barra de navegación */}
      <NavBarHome />
  
      {/* Contenido principal */}
      <div className="flex flex-1 flex-col sm:flex-row">

        <FiltradoProductos onFilter={handleFilterChange} />

        {/* Listar productos */}
        <div className="flex-grow p-2 sm:p-4">
          <ListarProductos filtro={filtro} />
        </div>
      </div>
  
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Productos;
