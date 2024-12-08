// Home.jsx
import React, { useRef, useEffect, useMemo, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import '../index.css';

// Lazy load components para mejorar el tiempo de carga inicial
const NavBarHome = lazy(() => import('../components/home/NavBarHome'));
const CarruselHome = lazy(() => import('../components/home/CarruselHome'));
const CategoriasHome = lazy(() => import('../components/home/CategoriasHome'));
const Footer = lazy(() => import('../components/home/Footer'));


// Importar imágenes desde la carpeta src/img
import image1 from '../img/1.webp';
import image2 from '../img/2.webp';
import image3 from '../img/3.webp';

function Home() {

  const categoriasRef = useRef(null);
  const location = useLocation();

  // const [currentIndex] = useState(0);
  // const navigate = useNavigate(); // Hook para redirigir al usuario
  
  //   // Función para verificar el token en localStorage y redirigir
  //   const checkAuth = () => {
  //     const token = localStorage.getItem('jwt');
  //     if (token) {
  //       // Decodificar el token JWT para obtener el rol y el estado del usuario
  //       const decodedToken = parseJwt(token);
  //       if (decodedToken) {
  //         const role = decodedToken.rol;
  //         if (role === 'admin') {
  //           // Redirigir al panel de admin si el rol es 'admin'
  //           navigate('/admin');
  //         } else if(role === 'familiar') {
  //            // Redirigir al panel de admin si el rol es 'admin'
  //            navigate('/familiar/camara');
  //         }else{
  //             // Redirigir al home si el rol no es nongun rol
  //            navigate('/');
  //         }
  //       }
  //     }
  //   };
  
  //   useEffect(() => {
  //     checkAuth(); // Verificar autenticación cuando el componente se monta
  //   }, []);

  //     // Función para parsear el token JWT
  //     const parseJwt = (token) => {
  //       try {
  //         const base64Url = token.split('.')[1];
  //         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //         const jsonPayload = decodeURIComponent(
  //           atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
  //         );
  //         return JSON.parse(jsonPayload);
  //       } catch (error) {
  //         console.error("Error al decodificar el token JWT:", error);
  //         return null;
  //       }
  //     };

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
     <div className="bg-gray-800 font-sans text-gray-200">
       {/* Usar Suspense para manejar componentes cargados de forma diferida */}
       <Suspense fallback={<div className="text-center text-white">Cargando...</div>}>
         {/* Barra de navegación */}
         <NavBarHome />
 
         {/* Carrusel debajo de la barra de navegación */}
         <CarruselHome images={images} interval={5000} />
 
         {/* Grid de categorías debajo del carrusel */}
         <div ref={categoriasRef}>
           <CategoriasHome />
         </div>
 
         {/* Footer */}
         <Footer />
       </Suspense>
     </div>
   );
 }
 
 export default Home;