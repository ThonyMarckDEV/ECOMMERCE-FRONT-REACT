import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../js/urlHelper';
import Notification from '../components/home/Notificacion'; // Importar el componente de notificación
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import LoadingScreen from '../components/home/LoadingScreen'; // Importar la pantalla de carga
import { GoogleLogin } from 'react-google-login'; // Importar Google Login

const Register = () => {
  const [name, setName] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dni, setDni] = useState('');
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

    if (!dni || dni.length !== 8 || !/^\d{8}$/.test(dni)) {
      newErrors.dni = 'El DNI debe tener exactamente 8 caracteres numéricos.';
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
    const { profileObj, tokenId } = response;

    try {
      const res = await fetch(`${API_BASE_URL}/api/registerUserGoogle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: profileObj.givenName + profileObj.familyName,
          correo: profileObj.email,
          googleToken: tokenId, // El token generado por Google
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setNotification({
          message: 'Usuario registrado exitosamente con Google',
          color: 'bg-green-400',
        });
        setTimeout(() => {
          navigate('/login');
        }, 1200);
      } else {
        setErrors(result.errors || {});
      }
    } catch (error) {
      console.error('Error al registrar con Google:', error);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Error en la autenticación de Google:', error);
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
            dni,
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
          setDni('');
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
    <div className="min-h-screen bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-sm relative">
        {loading && <LoadingScreen />} {/* Mostrar la pantalla de carga si 'loading' es verdadero */}

        <h2 className="text-2xl font-bold mb-4 text-center">Regístrate</h2>

        {/* Mostrar notificación si existe */}
        {notification && (
          <Notification description={notification.message} bgColor={notification.color} />
        )}

        <form onSubmit={handleRegister}>
          
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre completo</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              // Solo permitir letras y espacios
              const value = e.target.value;
              if (/^[A-Za-z\s]*$/.test(value)) {  // Acepta solo letras y espacios
                setName(value);
              }
            }}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">Apellidos</label>
          <input
            id="apellidos"
            type="text"
            value={apellidos}
            onChange={(e) => {
              // Solo permitir letras y espacios
              const value = e.target.value;
              if (/^[A-Za-z\s]*$/.test(value)) {  // Acepta solo letras y espacios
                setApellidos(value);
              }
            }}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
          {errors.apellidos && <p className="text-xs text-red-500">{errors.apellidos}</p>}
        </div>

          <div className="mb-4">
            <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI</label>
            <input
              id="dni"
              type="text"
              value={dni}
              onChange={(e) => {
                // Solo permitir números y limitar a 8 caracteres
                const value = e.target.value;
                if (/^\d{0,8}$/.test(value)) {
                  setDni(value);
                }
              }}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
              maxLength={8} // Limita el máximo de caracteres
            />
            {errors.dni && <p className="text-xs text-red-500">{errors.dni}</p>}
          </div>

  
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
            {errors.correo && <p className="text-xs text-red-500">{errors.correo}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Fecha de nacimiento</label>
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              min="1970-01-01"
            />
            {errors.birthDate && <p className="text-xs text-red-500">{errors.birthDate}</p>}
          </div>

          <div className="relative mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <AiFillEyeInvisible className="text-2xl" />
              ) : (
                <AiFillEye className="text-2xl" />
              )}
            </button>
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          <div className="relative mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Repetir Contraseña</label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? (
                <AiFillEyeInvisible className="text-2xl" />
              ) : (
                <AiFillEye className="text-2xl" />
              )}
            </button>
            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Regístrate
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition-colors mt-4"
          >
            Regresar
          </button>

        <div className="mt-4">
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
  );
};

export default Register;
