import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBarHome from '../../components/home/NavBarHome';
import LoadingScreen from '../../components/home/LoadingScreen';
import Notification from '../../components/home/Notificacion';
import ProductosCarrito from '../../components/userComponents/ProductosCarrito';
import { verificarYRenovarToken } from '../../js/authToken';
import API_BASE_URL from '../../js/urlHelper';
import { getIdUsuario } from '../../utilities/jwtUtils'; 
import { useCart } from '../../context/CartContext'; // Asegúrate de importar correctamente
import carritoVacio from '../../img/carritovacio.png'; // Asegúrate de que la ruta sea correcta
import logoyape from '../../img/yapelogo.png';
import mercadopagologo from '../../img/mercadopago.png';
import visalogo from '../../img/visalogo.jpg';
import SweetAlert from '../../components/SweetAlert'; // Importar SweetAlert

function Carrito() { 
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { updateCartCount } = useCart(); // Usamos el contexto de carrito
  const navigate = useNavigate();

  const obtenerCarrito = async () => {
    try {
      await verificarYRenovarToken();
      setIsLoading(true);
  
      const token = localStorage.getItem('jwt');
      const idUsuario = getIdUsuario(token);
  
      if (!idUsuario) {
        throw new Error("No se pudo obtener el ID del usuario.");
      }
  
      // Cambiamos la solicitud para enviar el idUsuario en el cuerpo
      const response = await fetch(`${API_BASE_URL}/api/carrito`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ idUsuario }),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProductos(data.data); // Incluye el idDetalle como parte del estado de los productos
        } else {
          SweetAlert.showMessageAlert('Error', 'No se pudo cargar el carrito.', 'error'); 
        }
      } else {
        SweetAlert.showMessageAlert('Error', 'Error al obtener los productos del carrito.', 'error'); 
      }
    } catch (error) {
      SweetAlert.showMessageAlert('Error', 'Ocurrió un error al obtener los productos.', 'error'); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    obtenerCarrito();
  }, []);

  const calcularTotal = () => {
    // Asegurarse de que el valor de cada subtotal es un número
    const totalSinIGV = productos.reduce((total, producto) => {
      const subtotal = producto.subtotal || 0;  // En caso de que el subtotal sea undefined o null, se asigna 0
      return total + parseFloat(subtotal);  // Aseguramos que el subtotal sea un número
    }, 0);
  
    // Calcular el IGV (18%)
    const igv = totalSinIGV * 0.18;
  
    // Calcular el total incluyendo el IGV
    const totalConIGV = totalSinIGV + igv;
  
    return totalConIGV;
  };


  const verificarDireccionUsuario = async () => {
    setIsLoading(true);
    try {
      await verificarYRenovarToken();
      const token = localStorage.getItem('jwt');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const idUsuario = payload.idUsuario;
  
      // Obtener datos del perfil
      const perfilResponse = await fetch(`${API_BASE_URL}/api/perfilCliente`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!perfilResponse.ok) {
        SweetAlert.showMessageAlert('Error', 'Error al obtener datos del perfil.', 'error'); 
        setIsLoading(false);
        return;
      }
  
      const perfilData = await perfilResponse.json();
      const dni = perfilData?.data?.dni;
  
      // Validar DNI
      if (!dni || dni.length < 8 || /^[0]+$/.test(dni)) {
        SweetAlert.showMessageAlert('Error', 'Por favor, actualiza tu DNI a uno válido antes de realizar un pedido.', 'error'); 
        setIsLoading(false);
        return;
      }
  
      // Verificar dirección
      const direccionResponse = await fetch(`${API_BASE_URL}/api/listarDireccionPedido/${idUsuario}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!direccionResponse.ok) {
        SweetAlert.showMessageAlert('Error', 'Error al verificar la dirección , agrega una en tu perfil..', 'error'); 
        setIsLoading(false);
        return;
      }
  
      const direccionUsando = await direccionResponse.json();
  
      if (direccionUsando && direccionUsando.idDireccion) {
        await proceedToCheckout(direccionUsando.idDireccion);
      } else {
        SweetAlert.showMessageAlert('Error', 'No tienes una dirección válida , agrega una en tu perfil.', 'error'); 
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      SweetAlert.showMessageAlert('Error', 'Error al verificar la dirección , agrega una en tu perfil.', 'error'); 
      setIsLoading(false);
    }
  };

  const clearCartUI = () => {
    setProductos([]);
  };

  const proceedToCheckout = async (idDireccion) => {
    const total = calcularTotal();
    const token = localStorage.getItem('jwt');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const idCarrito = payload.idCarrito;
    const idUsuario = payload.idUsuario;

    if (!idCarrito || !idUsuario) {
      SweetAlert.showMessageAlert('Error', 'Carrito o usuario no encontrados.', 'error'); 
        setIsLoading(false);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/pedido`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                total,
                idCarrito,
                idUsuario,
                idDireccion,  // Aquí se está enviando el idDireccion
            }),
        });

        if (!response.ok) throw new Error('Error al proceder al pedido');

        const data = await response.json();
        if (data.success) {
            clearCartUI();
            SweetAlert.showMessageAlert('Exito', 'Pedido realizado con éxito.', 'success'); 
            updateCartCount(); 
            setIsLoading(false);
             // Navegar después de 2 segundos
              setTimeout(() => {
                navigate('/pedidos');
            }, 1200);
        } else {
          SweetAlert.showMessageAlert('Error', 'Error al realizar el pedido.', 'error'); 
          setIsLoading(false);
           updateCartCount(); 
        }
    } catch (error) {
      SweetAlert.showMessageAlert('Error', 'Error al proceder con el pedido.', 'error'); 
        setIsLoading(false);
        updateCartCount(); 
    }
};

  
  const actualizarCantidad = async (idDetalle, cantidad) => {
    try {
      if (isNaN(cantidad) || cantidad < 1) {
        SweetAlert.showMessageAlert('Error', 'La cantidad debe ser un número mayor que 0.', 'error'); 
        return;
      }

      setIsLoading(true);

      const token = localStorage.getItem('jwt');
      const idUsuario = getIdUsuario(token);

      if (!token || !idUsuario) {
        SweetAlert.showMessageAlert('Error', 'Usuario no autenticado o token inválido.', 'error'); 
        return;
      }

      const requestBody = { cantidad, idUsuario };

      const response = await fetch(`${API_BASE_URL}/api/carrito_detalle/${idDetalle}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProductos((prevProductos) =>
            prevProductos.map((producto) =>
              producto.idDetalle === idDetalle
                ? { ...producto, cantidad, subtotal: producto.precio * cantidad }
                : producto
            )
          );
          SweetAlert.showMessageAlert('Exito!', 'Cantidad actualizada correctamente.', 'success'); 
        } else {
          SweetAlert.showMessageAlert('Error', 'Error al actualizar la cantidad.', 'error'); 
        }
      } else {
        SweetAlert.showMessageAlert('Error', 'Error al conectar con el servidor.', 'error'); 
      }
    } catch (error) {
      SweetAlert.showMessageAlert('Error', 'Ocurrió un error al actualizar la cantidad.', 'error'); 
    } finally {
      setIsLoading(false);
      updateCartCount();
    }
  };


  const eliminarProducto = async (idDetalle) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('jwt');

      const response = await fetch(`${API_BASE_URL}/api/carrito_detalle/${idDetalle}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          obtenerCarrito();
          SweetAlert.showMessageAlert('Exito!', 'Producto eliminado correctamente.', 'success'); 
        } else {
          SweetAlert.showMessageAlert('Error', 'Error al eliminar el producto.', 'error'); 
        }
      } else {
        SweetAlert.showMessageAlert('Error', 'Error al conectar con el servidor.', 'error'); 
      }
    } catch (error) {
      SweetAlert.showMessageAlert('Error', 'Ocurrió un error al eliminar el producto.', 'error'); 
    } finally {
      setIsLoading(false);
      updateCartCount();
    }
  };


  const [isMobile, setIsMobile] = useState(false);
  const drawerRef = useRef(null);
  const touchStartY = useRef(0);
  const currentTranslate = useRef(280); // Inicializar en 280 para que empiece cerrado
  const bodyRef = useRef(document.body);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para bloquear el scroll del body
  const disableBodyScroll = () => {
    if (bodyRef.current) {
      bodyRef.current.style.overflow = 'hidden';
      bodyRef.current.style.touchAction = 'none';
    }
  };

  // Función para habilitar el scroll del body
  const enableBodyScroll = () => {
    if (bodyRef.current) {
      bodyRef.current.style.overflow = '';
      bodyRef.current.style.touchAction = '';
    }
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    drawerRef.current.style.transition = 'none';
    disableBodyScroll();
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevenir scroll del body
    const touchY = e.touches[0].clientY;
    const diff = touchY - touchStartY.current;
    const newTranslate = Math.max(0, Math.min(280, currentTranslate.current + diff));
    
    drawerRef.current.style.transform = `translateY(${newTranslate}px)`;
  };

  const handleTouchEnd = () => {
    drawerRef.current.style.transition = 'transform 0.3s ease-out';
    const currentPosition = parseInt(drawerRef.current.style.transform.replace('translateY(', ''));
    
    if (currentPosition > 140) {
      drawerRef.current.style.transform = 'translateY(280px)';
      currentTranslate.current = 280;
    } else {
      drawerRef.current.style.transform = 'translateY(0)';
      currentTranslate.current = 0;
    }
    
    enableBodyScroll();
  };


  const MobileDrawer = () => (
    <div
      ref={drawerRef}
      className="fixed bottom-0 left-0 right-0 bg-white z-40 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] rounded-t-3xl touch-none"
      style={{
        height: '370px',
        transform: 'translateY(280px)',
        transition: 'transform 0.3s ease-out'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Línea de deslizar */}
      <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3" />
  
      {/* Vista minimizada (siempre visible) */}
      <div className="p-6 bg-white rounded-t-3xl">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Total (IGV 18%)</span>
          <span className="text-xl font-bold">S/.{calcularTotal().toFixed(2)}</span>
        </div>
      </div>
  
      {/* Contenido completo */}
      <div className="p-6 opacity-transition bg-white">
        <div className="space-y-4">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>S/.{(calcularTotal() / 1.18).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>IGV (18%)</span>
            <span>S/.{(calcularTotal() - (calcularTotal() / 1.18)).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Envío</span>
            <span className="text-green-600">Gratis</span>
          </div>
  
          <div className="pt-4">
            <button
              className="w-full bg-black text-white px-6 py-4 rounded-xl font-medium
                transform transition-all duration-300 
                hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={verificarDireccionUsuario}
              disabled={isLoading}
            >
              {isLoading ? 'Procesando...' : 'Hacer Pedido'}
            </button>
  
            <div className="mt-4 flex justify-center items-center gap-4 text-gray-400">
              <span className="text-sm">Aceptamos:</span>
              <div className="flex gap-3">
                <img
                  src={logoyape}
                  alt="Tarjeta 1"
                  className="w-8 h-5 object-contain rounded"
                />
                <img
                  src={visalogo}
                  alt="Tarjeta 2"
                  className="w-8 h-5 object-contain rounded"
                />
                <img
                  src={mercadopagologo}
                  alt="Tarjeta 3"
                  className="w-8 h-5 object-contain rounded"
                />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBarHome />
      
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="animate-bounce-in">
            <LoadingScreen />
          </div>
        </div>
      )}
      
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32 lg:pb-8">
        <h1 className="text-2xl sm:text-3xl font-light text-gray-800 mb-8 animate-fade-in text-center lg:text-left">
          Carrito de Compra {productos.length > 0 && `(${productos.length} Productos)`}
        </h1>

        {productos.length === 0 ? (
          <div className="animate-fade-in flex flex-col items-center justify-center py-16">
            <div className="text-center transform animate-scale-up max-w-md">
              <img
                src={carritoVacio}
                alt="Empty cart"
                className="mx-auto w-48 h-48 opacity-80 mb-6"
              />
              <h2 className="text-2xl text-gray-600 font-light mb-4">
                Tu carrito esta vacio.
              </h2>
              <p className="text-gray-500 mb-8">
                Ups. Parece que no hay nada en tu carrito.
              </p>
              <button 
                onClick={() => window.history.back()}
                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition duration-300"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8 animate-fade-in">
              <div className="space-y-6 lg:pr-6 lg:max-h-[80vh] lg:overflow-y-auto custom-scrollbar">
                <ProductosCarrito
                  productos={productos}
                  actualizarCantidad={actualizarCantidad}
                  eliminarProducto={eliminarProducto}
                  isLoading={isLoading}
                  API_BASE_URL={API_BASE_URL}
                />
              </div>
            </div>

            {/* Desktop Order Summary */}
            {!isMobile && (
              <div className="lg:col-span-4 animate-fade-in bg-white rounded-2xl shadow-sm border border-gray-200 h-fit sticky top-8">
                <div className="p-8">
                  <h2 className="text-xl font-medium mb-6">Resumen de Orden</h2>
                  <div className="space-y-4">
                    {/* ... Desktop summary content ... */}
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>S/.{(calcularTotal() / 1.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>IGV. (18%)</span>
                      <span>S/.{(calcularTotal() - (calcularTotal() / 1.18)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Envio</span>
                      <span className="text-green-600">Gratis</span>
                    </div>
                    <div className="h-px bg-gray-100 my-4" />
                    <div className="flex justify-between text-lg font-medium">
                      <span>Total</span>
                      <span>S/.{calcularTotal().toFixed(2)}</span>
                    </div>
                    
                    <button
                      className="w-full mt-6 bg-black text-white px-6 py-4 rounded-xl font-medium
                        transform transition-all duration-300 
                        hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      onClick={verificarDireccionUsuario}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Procesando...' : 'Hacer Pedido'}
                    </button>
                    
                    <div className="mt-6 flex flex-wrap justify-center gap-2 items-center text-gray-400">
                      <span className="text-sm">Aceptamos:</span>
                      <div className="flex gap-3">
                        <img
                          src={logoyape}
                          alt="Tarjeta 1"
                          className="w-8 h-5 object-contain rounded"
                        />
                        <img
                          src={visalogo}
                          alt="Tarjeta 2"
                          className="w-8 h-5 object-contain rounded"
                        />
                        <img
                          src={mercadopagologo}
                          alt="Tarjeta 3"
                          className="w-8 h-5 object-contain rounded"
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {isMobile && productos.length > 0 && <MobileDrawer />}
    </div>
  );
}

export default Carrito;
