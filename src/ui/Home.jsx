import React, { useRef, useEffect, useMemo, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import '../index.css';

import LoadingScreen from '../components/home/LoadingScreen';  // Importa el componente LoadingScreen

// Importar imágenes desde la carpeta src/img
import image1 from '../img/1.webp';
import image2 from '../img/2.webp';
import image3 from '../img/3.webp';

// Lazy load components para mejorar el tiempo de carga inicial
const NavBarHome = lazy(() => import('../components/home/NavBarHome'));
const CarruselHome = lazy(() => import('../components/home/CarruselHome'));
const CategoriasHome = lazy(() => import('../components/home/CategoriasHome'));
const Footer = lazy(() => import('../components/home/Footer'));

function Home() {
  const categoriasRef = useRef(null);
  const location = useLocation();

  // Memoizar el array de imágenes para evitar recreaciones en cada render
  const images = useMemo(() => [image1, image2, image3], []);

  useEffect(() => {
    // Detectar el parámetro de la URL y hacer scroll si es necesario
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get('scrollTo');
    if (scrollTo === 'categories' && categoriasRef.current) {
      categoriasRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location]);

  return (
    <div className="bg-white font-sans text-gray-200">
      {/* Usar Suspense para manejar componentes cargados de forma diferida */}
      <Suspense fallback={<LoadingScreen />}>  {/* Cambiar el fallback a LoadingScreen */}
        {/* Barra de navegación */}
        <NavBarHome />

        {/* Carrusel debajo de la barra de navegación */}
        <CarruselHome images={images} interval={5000} />

        {/* Grid de categorías debajo del carrusel */}
        <div ref={categoriasRef} className="py-16">
          <CategoriasHome />
        </div>

        {/* Footer */}
        <Footer />
      </Suspense>
    </div>
  );
}

export default Home;
