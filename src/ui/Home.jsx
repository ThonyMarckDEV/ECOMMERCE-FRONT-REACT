import '../index.css';

//Componentes HOME
import NavBarHome from '../components/home/NavBarHome'; 
import CarruselHome from '../components/home/CarruselHome'; 
import CategoriasHome from '../components/home/CategoriasHome';
import Footer from '../components/home/Footer';

//IMAGENES CARRUSEL
import image1 from '../img/1.webp';
import image2 from '../img/2.webp';
import image3 from '../img/3.webp';



function Home() {

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



  // Array de imágenes
  const images = [
    image1, // Imagen local
    image2, // Imagen local
    image3, // Imagen local
  ];

  return (
    <div className="bg-gray-800 font-sans text-gray-200">
      {/* Barra de navegación */}
      <NavBarHome />
      
      {/* Carrusel debajo de la barra de navegación */}
      <div >
        <CarruselHome images={images} interval={5000} />
      </div>

      {/* Grid de categorías debajo del carrusel */}
      <div >
        <CategoriasHome />
      </div>


       {/* Footer */}
       <Footer />

    </div>
  );
}

export default Home;