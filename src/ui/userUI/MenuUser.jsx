import React, { Suspense, lazy } from 'react';
import '../../index.css';

// Lazy load components para mejorar el tiempo de carga inicial
const NavBarHome = lazy(() => import('../../components/home/NavBarHome'));
const SeccionMenu = lazy(() => import('./SeccionMenu'));

function MenuUser() {
  return (
    <div className="bg-gray-200 font-sans text-gray-200 min-h-screen overflow-hidden"> {/* Aseguramos que no haya desbordamiento */}

      {/* Barra de navegación fuera del contenedor central */}
      <Suspense fallback={<div>Loading...</div>}>
        <NavBarHome />
      </Suspense>

      {/* Contenedor centralizado */}
      <div className="flex justify-center items-start mt-4">
        {/* Contenedor principal con barra lateral y las secciones */}
        <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-4">
          {/* Sección de menú lateral */}
          <Suspense fallback={<div>Loading...</div>}>
            <SeccionMenu />
          </Suspense>
        </div>
      </div>

    </div>
  );
}

export default MenuUser;
