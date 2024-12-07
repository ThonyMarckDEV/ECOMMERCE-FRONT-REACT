import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../js/urlHelper';
import { AiOutlineFilter, AiOutlineClose } from 'react-icons/ai'; // Usamos un ícono de filtro

function FiltradoProductos({ onFilter }) {
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState({ texto: '', categoria: '' });
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar si el filtro está abierto o cerrado

  useEffect(() => {
    // Fetch categorías desde la API
    fetch(`${API_BASE_URL}/api/listarCategorias`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        return response.json();
      })
      .then((data) => {
        setCategorias(data.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, []);

  useEffect(() => {
    // Bloquear o permitir el scroll del body según si el filtro está abierto
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Bloquear el scroll cuando el filtro está abierto
    } else {
      document.body.style.overflow = 'auto'; // Restaurar el scroll cuando el filtro está cerrado
    }

    // Limpiar el estilo al desmontar el componente
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFiltro = { ...filtro, [name]: value };
    setFiltro(updatedFiltro);
    onFilter(updatedFiltro); // Pasar el filtro actualizado al componente padre
  };

  const toggleFilter = () => {
    setIsOpen(!isOpen); // Alternar la visibilidad del filtro
  };

  return (
    <>
      {/* Botón para abrir/cerrar el filtro solo en móviles */}
      <button
        onClick={toggleFilter}
        className="lg:hidden block absolute top-20 left-4 z-20 p-2 bg-black text-white rounded-full shadow-md hover:bg-gray-800"
      >
        {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineFilter size={24} />}
      </button>

      {/* Fondo negro transparente que aparece cuando el filtro se abre en móviles */}
      {isOpen && (
        <div
          onClick={toggleFilter} // Cierra el filtro cuando se hace click en el fondo
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
        />
      )}

      {/* Contenedor del filtro deslizable */}
      <aside
        className={`lg:block fixed inset-x-0 lg:top-0 top-20 bottom-0 bg-gray-100 p-4 w-64 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:w-64 z-10  overflow-hidden`}
      >
        <h2 className="text-xl font-bold mb-4 text-black">Filtrar Productos</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-1">Buscar por nombre</label>
          <input
            type="text"
            name="texto"
            value={filtro.texto}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 bg-white text-gray-800"
            placeholder="Nombre del producto"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Categoría</label>
          <select
            name="categoria"
            value={filtro.categoria}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 bg-white text-gray-800"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria.idCategoria} value={categoria.idCategoria}>
                {categoria.nombreCategoria}
              </option>
            ))}
          </select>
        </div>
      </aside>
    </>
  );
}

export default FiltradoProductos;


