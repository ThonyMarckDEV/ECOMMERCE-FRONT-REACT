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
    console.log("Filtro actualizado:", nuevoFiltro); // Verifica que el filtro esté cambiando
    setFiltro(nuevoFiltro);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white-800 font-sans text-gray-200">

      {/* Barra de navegación */}
      <NavBarHome />
  
      {/* Contenido principal */}
      <div className="flex flex-col sm:flex-row flex-grow">
        {/* Filtrado de productos */}
        <FiltradoProductos onFilter={handleFilterChange} />
  
        {/* Listar productos */}
        <div className="flex-grow flex justify-center sm:justify-start items-center w-full">
          <ListarProductos filtro={filtro} />
        </div>
      </div>
  
      {/* Footer */}
      <Footer />
    </div>
  );
  
}

export default Productos;
