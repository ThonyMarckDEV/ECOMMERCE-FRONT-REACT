import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../js/urlHelper';
import Notification from '../components/home/Notificacion'; // Importar el componente de notificación
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import LoadingScreen from '../components/home/LoadingScreen'; // Importar la pantalla de carga
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // Cambiar a la nueva librería


const Register = () => {
  const [name, setName] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState('');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState(null); // Estado para manejar la notificación
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para manejar la carga

  const navigate = useNavigate();

  // Calcular la edad basado en la fecha de nacimiento
  useEffect(() => {
    if (birthDate) {
      const birthDateObj = new Date(birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDateObj.getFullYear();
      const month = today.getMonth() - birthDateObj.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < birthDateObj.getDate())) {
        setAge(age - 1); // Si el cumpleaños no ha ocurrido este año, restamos 1
      } else {
        setAge(age);
      }
    }
  }, [birthDate]);

  const validateForm = () => {
    const newErrors = {};

    if (!name) {
      newErrors.name = 'El nombre es obligatorio.';
    }

    if (!apellidos || apellidos.split(' ').length < 2) {
      newErrors.apellidos = 'Debe ingresar al menos dos apellidos separados por un espacio.';
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailPattern.test(email)) {
      newErrors.email = 'Debe ingresar un correo válido.';
    }

    if (age && (isNaN(age) || age < 18 || age > 100)) {
      newErrors.age = 'La edad debe ser un número entero entre 18 y 100.';
    }

    if (birthDate && new Date(birthDate) > new Date()) {
      newErrors.birthDate = 'La fecha de nacimiento debe ser anterior a hoy.';
    }

    if (!password || password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleSuccess = async (response) => {
    setLoading(true); // Mostrar el loader mientras se realiza el registro e inicio de sesión con Google
    const tokenId = response.credential; // Obtén el token desde el nuevo flujo de Google
    
    try {
      // Registrar al usuario con el token de Google
      const res = await fetch(`${API_BASE_URL}/api/registerUserGoogle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleToken: tokenId, // El token generado por Google
        }),
      });
  
      const result = await res.json();
      if (res.ok) {
        setNotification({
          message: 'Usuario registrado exitosamente con Google',
          color: 'bg-green-400',
        });
  
        // Ahora que el usuario está registrado, realizar login automáticamente
        const loginResponse = await fetch(`${API_BASE_URL}/api/login-google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            googleToken: tokenId, // Enviar el token para realizar login
          }),
        });
  
        const loginResult = await loginResponse.json();
  
        if (loginResponse.ok) {
          localStorage.setItem('jwt', loginResult.token); // Guardar el JWT en localStorage
  
          // Redirigir a la página principal después de iniciar sesión correctamente
          setLoading(false); // Ocultar el loader antes de redirigir
          window.location.href = '/';
        } else {
          setErrors(loginResult.errors || {});
        }
      } else {
        setErrors(result.errors || {});
      }
    } catch (error) {
      console.error('Error al registrar e iniciar sesión con Google:', error);
    } finally {
      // No es necesario aquí, pero lo dejamos por si el flujo llega al bloque finally
      // setLoading(false); // Ocultar el loader en caso de error
    }
  };
  
  const handleGoogleFailure = (error) => {
    console.error('Error en la autenticación de Google:', error);
    setLoading(false); // Asegúrate de ocultar el loader en caso de error
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      const [firstName, secondName] = name.split(' ');
      const [firstLastName, secondLastName] = apellidos.split(' ');
  
      const generatedUsername = `${firstName.substring(0, 2)}${firstLastName}${secondLastName.charAt(0)}`;
  
      setLoading(true); // Mostrar la pantalla de carga
  
      try {
        const response = await fetch(`${API_BASE_URL}/api/registerUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: generatedUsername,
            correo: email,
            password,
            nombres: name,
            apellidos,
            rol: 'cliente',
            edad: age, // Enviar la edad calculada
            nacimiento: birthDate,
          }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          setNotification({
            message: 'Usuario registrado exitosamente',
            color: 'bg-green-400', // Color de la notificación (verde claro)
          });
  
          // Limpiar los campos después de un registro exitoso
          setName('');
          setApellidos('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setAge('');
          setBirthDate('1990-01-01');
          setErrors({}); // Limpiar errores
  
          // Después de 3 segundos, redirigimos al login
          setTimeout(() => {
            navigate('/login');
          }, 1200);
        } else {
          setErrors(result.errors || {});
        }
      } catch (error) {
        console.error('Error al registrar el usuario:', error);
      } finally {
        setLoading(false); // Ocultar la pantalla de carga
      }
    }
  };

  return (
    <GoogleOAuthProvider clientId="265411714077-7as2ltld99egmkrtg7p25la9t6d2r4bb.apps.googleusercontent.com">
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Desktop: título arriba, Mobile: mantiene el diseño vertical */}
          <div className="flex flex-col items-center">
            {/* Título animado */}
            <div className="text-center mb-12 animate-fade-in-down">
              <h1 className="text-4xl font-light mb-4 tracking-wider">
                Crear cuenta
              </h1>
              <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto animate-fade-in opacity-0 [animation-delay:0.3s] [animation-fill-mode:forwards]">
                Únete a nuestra comunidad de compradores y disfruta de una experiencia de compra personalizada.
              </p>
            </div>
  
    
            {/* Formulario centrado */}
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl p-8 animate-fade-in opacity-0 [animation-delay:0.6s] [animation-fill-mode:forwards]">
              {loading && <LoadingScreen />}

              {notification && (
                <Notification description={notification.message} bgColor={notification.color} />
              )}

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900 group-hover:text-black transition-colors">
                      Nombre
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[A-Za-z\s]*$/.test(value)) {
                          setName(value);
                        }
                      }}
                      className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-black placeholder-gray-400 transition-all py-4"
                      required
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                  </div>

                  <div className="group">
                    <label htmlFor="apellidos" className="block text-sm font-medium text-gray-900 group-hover:text-black transition-colors">
                      Apellidos
                    </label>
                    <input
                      id="apellidos"
                      type="text"
                      value={apellidos}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[A-Za-z\s]*$/.test(value)) {
                          setApellidos(value);
                        }
                      }}
                      className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-black placeholder-gray-400 transition-all py-4"
                      required
                    />
                    {errors.apellidos && <p className="mt-1 text-sm text-red-400">{errors.apellidos}</p>}
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 group-hover:text-black transition-colors">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-black placeholder-gray-400 transition-all py-4"
                    required
                  />
                  {errors.correo && <p className="mt-1 text-sm text-red-400">{errors.correo}</p>}
                </div>

                <div className="group">
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-900 group-hover:text-black transition-colors">
                    Fecha de nacimiento
                  </label>
                  <input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-black placeholder-gray-400 transition-all py-4"
                  />
                  {errors.birthDate && <p className="mt-1 text-sm text-red-400">{errors.birthDate}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-900 group-hover:text-black transition-colors">
                      Contraseña
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-black pr-10 transition-all py-4"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-black"
                      >
                        {showPassword ? <AiFillEyeInvisible className="h-5 w-5" /> : <AiFillEye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                  </div>

                  <div className="group">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 group-hover:text-black transition-colors">
                      Confirmar contraseña
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-black pr-10 transition-all py-4"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-black"
                      >
                        {showConfirmPassword ? <AiFillEyeInvisible className="h-5 w-5" /> : <AiFillEye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-4 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300 ease-in-out text-sm font-medium transform hover:scale-[1.02]"
                  >
                    Crear cuenta
                  </button>

                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-transparent text-black py-4 px-4 rounded-md border border-black/30 hover:bg-black/10 transition-colors duration-300 ease-in-out text-sm font-medium"
                  >
                    Regresar
                  </button>
                </div>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-black">O continúa con</span>
                  </div>
                </div>

                <div className="mt-6">
                  <GoogleLogin
                    clientId="265411714077-7as2ltld99egmkrtg7p25la9t6d2r4bb.apps.googleusercontent.com"
                    buttonText="Registrarse con Google"
                    onSuccess={handleGoogleSuccess}
                    onFailure={handleGoogleFailure}
                    cookiePolicy={'single_host_origin'}
                    responseType="code"
                  />
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};



export default Register;
