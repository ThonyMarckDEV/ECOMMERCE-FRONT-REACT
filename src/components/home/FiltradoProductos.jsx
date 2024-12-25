import React, { useEffect, useState } from 'react';
import { AiOutlineFilter, AiOutlineClose, AiOutlineDown, AiOutlineSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import API_BASE_URL from '../../js/urlHelper';

function FiltradoProductos({ onFilter }) {
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState({
    texto: '',
    categoria: '',
    precioInicial: 0,
    precioFinal: 500
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFiltro((prevFiltro) => ({ ...prevFiltro, [name]: value }));
  };

  const handlePriceChange = (value) => {
    setFiltro((prevFiltro) => ({
      ...prevFiltro,
      precioInicial: value[0],
      precioFinal: value[1]
    }));
  };

  const handleApplyFilters = () => {
    onFilter(filtro);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const resetFiltro = {
      texto: '',
      categoria: '',
      precioInicial: 0,
      precioFinal: 500
    };
    setFiltro(resetFiltro);
    onFilter(resetFiltro);
    setIsOpen(false);
    navigate('/productos');
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg"
      >
        <span>Filtros</span>
        <AiOutlineDown className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Filter Sidebar */}
      <div className={`
        fixed md:relative top-0 right-0 h-full md:h-auto w-80 md:w-64
        bg-white md:bg-transparent z-50 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-6 space-y-6">
          {/* Mobile Header */}
          <div className="flex justify-between items-center md:hidden">
            <h2 className="text-xl font-semibold">Filtrar Productos</h2>
            <button onClick={() => setIsOpen(false)}>
              <AiOutlineClose className="w-6 h-6" />
            </button>
          </div>

          {/* Search Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Buscar por nombre</label>
            <div className="relative">
              <input
                type="text"
                name="texto"
                value={filtro.texto}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Buscar productos..."
              />
              <AiOutlineSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Categoría</label>
            <select
              name="categoria"
              value={filtro.categoria}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.idCategoria}>
                  {categoria.nombreCategoria}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Rango de Precio</label>
            <div className="space-y-4">
              <Slider
                range
                min={0}
                max={1000}
                value={[filtro.precioInicial, filtro.precioFinal]}
                onChange={handlePriceChange}
                className="w-full"
              />
              <div className="text-sm text-gray-600 text-center">
                S/.{filtro.precioInicial} - S/.{filtro.precioFinal}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleApplyFilters}
              className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              Aplicar Filtros
            </button>
            <button
              onClick={handleResetFilters}
              className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reiniciar Filtros
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FiltradoProductos;