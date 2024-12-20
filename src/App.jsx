import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './index.css';
import VerificarCorreo from './ui/VerificarCorreo';
import VerificarCorreoToken from './ui/VerificarCorreoToken';
import Mantenimiento from './components/home/Mantenimiento'; // Componente de mantenimiento
import API_BASE_URL from './js/urlHelper';

// Componentes Home
import Home from './ui/Home';
import Productos from './ui/Productos';
import Login from './ui/Login';
import Register from './ui/Register';

// UIS
//USERUI
import Carrito from './ui/userUI/MiCarrito';
import MenuUser from './ui/userUI/MenuUser';
import Pedidos from './ui/userUI/MisPedidos';

//ADMINUI
import Admin from './ui/adminUI/Admin';
import EditarUsuario from './ui/adminUI/EditarUsuario';


// Utilities
import ProtectedRouteHome from './utilities/ProtectedRouteHome';
import ProtectedRouteRolCliente from './utilities/ProtectedRouteRolCliente';
import ProtectedRouteRolAdmin from './utilities/ProtectedRouteRolAdmin';
import ProtectedRouteRolMarca from './utilities/ProtectedRouteRolMarca';
import ProtectedRouteToken from './utilities/ProtectedRouteToken';

// Scripts
import { updateLastActivity } from './js/lastActivity';


// Context del carrito
import { CartProvider } from './context/CartContext';

function AppContent() {
  const [enMantenimiento, setEnMantenimiento] = useState(false);
  const [mensajeMantenimiento, setMensajeMantenimiento] = useState('');
  const location = useLocation();

  // Verificar estado de mantenimiento al cargar
  useEffect(() => {
    const verificarMantenimiento = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/status-mantenimiento`); // Ruta de tu API Laravel
        if (response.ok) {
          const data = await response.json();
          if (data.estado === 1) {
            setEnMantenimiento(true);
            setMensajeMantenimiento(data.mensaje);
          } else {
            setEnMantenimiento(false);
          }
        } else {
          console.error('Error al obtener el estado de mantenimiento.');
        }
      } catch (error) {
        console.error('Error en la solicitud de mantenimiento:', error);
      }
    };

    verificarMantenimiento();
  }, [location.pathname]);

  // Actualizar la actividad del usuario si no está en mantenimiento
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!enMantenimiento && token) {

      updateLastActivity();
        
        const intervalId = setInterval(() => {
          updateLastActivity();
        }, 10000);

        return () => clearInterval(intervalId);
    }
  }, [location.pathname, enMantenimiento]);

  if (enMantenimiento) {
    return <Mantenimiento mensaje={mensajeMantenimiento} />;
  }

  return (
    <Routes>
      <Route path="/" element={<ProtectedRouteHome element={<Home />} />} />
      <Route path="/login" element={<ProtectedRouteHome element={<Login />} />} />
      <Route path="/register" element={<ProtectedRouteHome element={<Register />} />} />
      <Route path="/productos" element={<ProtectedRouteHome element={<Productos />} />} />

      {/* RUTAS ROL ADMIN */}
      <Route path="/admin" element={<ProtectedRouteRolAdmin element={<Admin />} />} />
      <Route path="/admin/usuarios/editar" element={<ProtectedRouteRolAdmin element={<EditarUsuario />} />} />



      {/* RUTAS ROL MARCA*/}

      {/* RUTAS ROL CLIENTE */}
      <Route path="/menuUsuario" element={<ProtectedRouteRolCliente element={<MenuUser />} allowedRoles={['cliente']} />} />
      <Route path="/pedidos" element={<ProtectedRouteRolCliente element={<Pedidos />} allowedRoles={['cliente']} />} />
      <Route path="/carrito" element={<ProtectedRouteRolCliente element={<Carrito />} allowedRoles={['cliente']} />} />

    
      <Route path="/verificar-correo" element={<ProtectedRouteToken element={<VerificarCorreo />} />} />
      <Route path="/verificar-correo-token" element={<VerificarCorreoToken />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </Router>
  );
}

export default App;


// function ClienteRoutes() {
//   return (
//     <CartProvider>
//       <Routes>
//         <Route path="/menuUsuario" element={<ProtectedRouteRolCliente element={<MenuUser />} allowedRoles={['cliente']} />} />
//         <Route path="/pedidos" element={<ProtectedRouteRolCliente element={<Pedidos />} allowedRoles={['cliente']} />} />
//         <Route path="/carrito" element={<ProtectedRouteRolCliente element={<Carrito />} allowedRoles={['cliente']} />} />
//       </Routes>
//     </CartProvider>
//   );
// }

// function AdminRoutes() {
//   return (
//     <Routes>
//       <Route path="/admin" element={<ProtectedRouteRolAdmin element={<Admin />} />} />
//       <Route path="/admin/usuarios/editar" element={<ProtectedRouteRolAdmin element={<EditarUsuario />} />} />
//     </Routes>
//   );
// }

// function AppContent() {
//   const [enMantenimiento, setEnMantenimiento] = useState(false);
//   const [mensajeMantenimiento, setMensajeMantenimiento] = useState('');
//   const location = useLocation();

//   // Verificar estado de mantenimiento
//   useEffect(() => {
//     const verificarMantenimiento = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/status-mantenimiento`);
//         if (response.ok) {
//           const data = await response.json();
//           setEnMantenimiento(data.estado === 1);
//           setMensajeMantenimiento(data.mensaje || '');
//         } else {
//           console.error('Error al obtener el estado de mantenimiento.');
//         }
//       } catch (error) {
//         console.error('Error en la solicitud de mantenimiento:', error);
//       }
//     };

//     verificarMantenimiento();
//   }, [location.pathname]);

//   // Actualizar actividad del usuario si no está en mantenimiento
//   useEffect(() => {
//     const token = localStorage.getItem('jwt');
//     const updateLastActivity = () => {
//       fetch(`${API_BASE_URL}/api/actualizar-actividad`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//     };

//     if (!enMantenimiento && token) {
//       updateLastActivity();
//       const intervalId = setInterval(updateLastActivity, 10000); // Actualiza cada 10 segundos
//       return () => clearInterval(intervalId);
//     }
//   }, [location.pathname, enMantenimiento]);

//   if (enMantenimiento) {
//     return <Mantenimiento mensaje={mensajeMantenimiento} />;
//   }

//   return (
//     <Routes>
//       {/* RUTAS PÚBLICAS */}
//       <Route path="/" element={<ProtectedRouteHome element={<Home />} />} />
//       <Route path="/login" element={<ProtectedRouteHome element={<Login />} />} />
//       <Route path="/register" element={<ProtectedRouteHome element={<Register />} />} />
//       <Route path="/productos" element={<ProtectedRouteHome element={<Productos />} />} />

//       {/* RUTAS CLIENTE */}
//       <Route path="/*" element={<ClienteRoutes />} />

//       {/* RUTAS ADMIN */}
//       <Route path="/*" element={<AdminRoutes />} />

//       {/* VERIFICACIÓN */}
//       <Route path="/verificar-correo" element={<ProtectedRouteToken element={<VerificarCorreo />} />} />
//       <Route path="/verificar-correo-token" element={<VerificarCorreoToken />} />

//       {/* REDIRECCIÓN */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }

// export default App;