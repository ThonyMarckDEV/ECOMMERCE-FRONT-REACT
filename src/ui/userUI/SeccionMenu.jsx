import React, { useState } from 'react';
import MiPerfil from '../userUI/PerfilUser';
import AgregarDireccion from './AgregarDireccion';
import Direcciones from './Direcciones';

const Sidebar = () => {
  const [selectedSection, setSelectedSection] = useState('MiPerfil');  
  const [isOpen, setIsOpen] = useState(false);  // Estado para controlar la visibilidad del menú en móvil

  // Función para manejar la selección de una sección
  const handleSectionSelect = (section) => {
    setSelectedSection(section);
    setIsOpen(false);  // Cerrar el menú en móviles cuando se selecciona una opción
  };

  // Función para alternar la visibilidad del menú en móviles
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[80vh]">
      {/* Barra lateral */}
      <div
        className={`w-full md:w-80 bg-white border-r border-black text-black p-6 space-y-6 fixed md:relative inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold text-center mb-8">Menú</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => handleSectionSelect('MiPerfil')}
              className={`w-full text-left p-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition ${selectedSection === 'MiPerfil' ? 'bg-gray-200' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM12 22c2.75 0 5-2.25 5-5H7c0 2.75 2.25 5 5 5z" />
              </svg>
              <span>Mi Perfil</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSectionSelect('AgregarDireccion')}
              className={`w-full text-left p-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition ${selectedSection === 'AgregarDireccion' ? 'bg-gray-200' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Agregar Dirección</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSectionSelect('Direcciones')}
              className={`w-full text-left p-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition ${selectedSection === 'Direcciones' ? 'bg-gray-200' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v18H3V3z" />
              </svg>
              <span>Mis Direcciones</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Botón flotante para abrir la barra lateral */}
      <button
        className="md:hidden text-white bg-black p-4 rounded-full fixed top-20 left-6 z-50"
        onClick={toggleMenu}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Contenido principal */}
      <div className="flex-1 p-6 bg-gray-100">
        {/* Mostrar contenido según la sección seleccionada */}
        {selectedSection === 'MiPerfil' && <MiPerfil />}
        {selectedSection === 'AgregarDireccion' && <AgregarDireccion />}
        {selectedSection === 'Direcciones' && <Direcciones />}

        {/* Mensaje predeterminado si no hay ninguna opción seleccionada */}
        {selectedSection === null && (
          <div className="flex justify-center items-center h-full text-gray-600">
            <h2 className="text-xl font-semibold">Selecciona una opción para comenzar</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;