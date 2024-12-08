// FiltradoProductos.jsx
import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../js/urlHelper';
import { AiOutlineFilter, AiOutlineClose } from 'react-icons/ai';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'; // Importar estilos de rc-slider

function FiltradoProductos({ onFilter }) {
  const [categorias, setCategorias] = useState([]);
  
  // Estado para almacenar los filtros actuales que el usuario está seleccionando
  const [filtro, setFiltro] = useState({
    texto: '',
    categoria: '',
    precioInicial: 0,
    precioFinal: 500
  });

  // Estado para manejar los filtros que han sido aplicados
  const [appliedFiltro, setAppliedFiltro] = useState({
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
    setFiltro((prevFiltro) => ({ ...prevFiltro, [name]: value }));
  };

  const handlePriceChange = (value) => {
    const [min, max] = value;
    setFiltro((prevFiltro) => ({ ...prevFiltro, precioInicial: min, precioFinal: max }));
  };

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  // Función para aplicar los filtros
  const handleApplyFilters = () => {
    setAppliedFiltro(filtro);
    onFilter(filtro);
    setIsOpen(false); // Cerrar el panel de filtros en móviles después de aplicar
  };

  // Función para reiniciar los filtros a sus valores predeterminados
  const handleResetFilters = () => {
    const resetFiltro = {
      texto: '',
      categoria: '',
      precioInicial: 0,
      precioFinal: 500
    };
    setFiltro(resetFiltro);
    setAppliedFiltro(resetFiltro);
    onFilter(resetFiltro);
    setIsOpen(false); // Cerrar el panel de filtros en móviles después de reiniciar
  };

  return (
    <>
      {/* Botón para abrir/cerrar el filtro solo en móviles */}
      <button
        onClick={toggleFilter}
        className="lg:hidden block absolute top-20 left-4 z-40 p-2 bg-black text-white rounded-full shadow-md hover:bg-gray-800"
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
        className={`lg:block fixed inset-x-0 lg:top-0 top-20 bottom-0 bg-gray-100 p-4 w-64 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative lg:w-64 z-20 overflow-y-auto`}
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
        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-2">
            Rango de Precio
          </label>
          
          {/* Slider */}
          <Slider
            range
            min={0}
            max={500}
            step={1} // Define el paso para mayor precisión
            allowCross={false} // Evita que los handles se crucen
            value={[filtro.precioInicial, filtro.precioFinal]}
            onChange={handlePriceChange}
            trackStyle={[{ backgroundColor: '#000000' }]}
            handleStyle={[
              { borderColor: '#000000' },
              { borderColor: '#000000' },
            ]}
            railStyle={{ backgroundColor: '#d9d9d9' }}
          />

          {/* Rango de precio debajo del slider */}
          <div className="mt-2 text-sm text-black">
            S/.{filtro.precioInicial} - S/.{filtro.precioFinal}
          </div>
        </div>

        {/* Botones de Aplicar y Reiniciar Filtros */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleApplyFilters}
            className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={handleResetFilters}
            className="w-full px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors"
          >
            Reiniciar Filtros
          </button>
        </div>
      </aside>
    </>
  );
}

export default FiltradoProductos;
