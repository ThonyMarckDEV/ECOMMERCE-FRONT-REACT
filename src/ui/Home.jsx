import React, { useRef, useEffect, useMemo, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import '../index.css';

import LoadingScreen from '../components/home/LoadingScreen';

// Importar imágenes desde la carpeta src/img
import image1 from '../img/1.webp';
import image2 from '../img/2.webp';
import image3 from '../img/3.webp';

// Lazy load components
const NavBarHome = lazy(() => import('../components/home/NavBarHome'));
const CarruselHome = lazy(() => import('../components/home/CarruselHome'));
const CategoriasHome = lazy(() => import('../components/home/CategoriasHome'));
const Footer = lazy(() => import('../components/home/Footer'));
//const Testimonios = lazy(() => import('../components/home/Testimonios'));
//const OfertasDestacadas = lazy(() => import('../components/home/OfertasDestacadas'));
//const MarcasColaboradoras = lazy(() => import('../components/home/MarcasColaboradoras'));

function Home() {
  const categoriasRef = useRef(null);
  const location = useLocation();

  const images = useMemo(() => [image1, image2, image3], []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get('scrollTo');
    if (scrollTo === 'categories' && categoriasRef.current) {
      categoriasRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location]);

  return (
    <div className="bg-white font-sans text-gray-800">
      {/* Suspense para manejar componentes cargados de forma diferida */}
      <Suspense fallback={<LoadingScreen />}>
        {/* Barra de navegación */}
        <div className="animate-fade-in shadow-2xl bg-white/95 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200">
          <NavBarHome />
        </div>

        {/* Carrusel debajo de la barra de navegación */}
        <div className="animate-fade-in-down transform transition-transform duration-500 hover:scale-105">
          <CarruselHome images={images} interval={3000} />
        </div>

        {/* Sección de ofertas destacadas */}
        {/* <div className="py-24 bg-gradient-to-b from-white to-gray-50 animate-fade-in">
          <div className="container mx-auto px-8">
            <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-800">
              Ofertas <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Destacadas</span>
            </h2>
            {/* <OfertasDestacadas />
          </div>
        </div> */}

        {/* Grid de categorías debajo del carrusel */}
        <div ref={categoriasRef} className="py-32 bg-gradient-to-b from-gray-50 to-white animate-fade-in">
          <div className="container mx-auto px-8">
            <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-800">
              Explora Nuestras <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Categorías</span>
            </h2>
            <CategoriasHome />
          </div>
        </div>

        {/* Sección de marcas colaboradoras */}
        {/* <div className="py-24 bg-gradient-to-b from-white to-gray-50 animate-fade-in">
          <div className="container mx-auto px-8">
            <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-800">
              Nuestras <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Marcas</span>
            </h2>
            {/* <MarcasColaboradoras /> 
          </div>
        </div> */}

        {/* Sección de testimonios
        <div className="py-24 bg-gradient-to-b from-gray-50 to-white animate-fade-in">
          <div className="container mx-auto px-8">
            <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-800">
              Lo que dicen <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">nuestros clientes</span>
            </h2>
            {/* <Testimonios /> 
          </div>
        </div> */}


        <Footer />

        </Suspense>
    </div>
  );
}

export default Home;