import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../js/urlHelper';
import { AiOutlineFilter, AiOutlineClose } from 'react-icons/ai';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'; // Importar estilos de rc-slider

function FiltradoProductos({ onFilter }) {
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState({
    texto: '',
    categoria: '',
    precioInicial: 0,
    precioFinal: 500
  });
  const [isOpen, setIsOpen] = useState(false);

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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
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
    onFilter(updatedFiltro);
  };

  const handlePriceChange = (value) => {
    const [min, max] = value;
    const updatedFiltro = { ...filtro, precioInicial: min, precioFinal: max };
    setFiltro(updatedFiltro);
    onFilter(updatedFiltro);
  };

  const toggleFilter = () => {
    setIsOpen(!isOpen);
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
          onClick={toggleFilter}
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
        />
      )}

      {/* Contenedor del filtro deslizable */}
      <aside
        className={`lg:block fixed inset-x-0 lg:top-0 top-20 bottom-0 bg-gray-100 p-4 w-64 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:w-64 z-10 overflow-hidden`}
      >
        <h2 className="text-xl font-bold mb-4 text-black">Filtrar Productos</h2>
        
        {/* Filtro por nombre */}
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
        
        {/* Filtro por categoría */}
        <div className="mb-4">
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
        
        {/* Filtro por rango de precios */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-2">Rango de Precio: ${filtro.precioInicial} - ${filtro.precioFinal}</label>
          <Slider
            range
            min={0}
            max={500}
            defaultValue={[filtro.precioInicial, filtro.precioFinal]}
            value={[filtro.precioInicial, filtro.precioFinal]}
            onChange={(value) => handlePriceChange(value)}
            trackStyle={[{ backgroundColor: '#4A90E2' }]}
            handleStyle={[
              { borderColor: '#4A90E2' },
              { borderColor: '#4A90E2' }
            ]}
            railStyle={{ backgroundColor: '#d9d9d9' }}
          />
        </div>
      </aside>
    </>
  );
}

export default FiltradoProductos;