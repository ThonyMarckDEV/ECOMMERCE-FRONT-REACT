import React, { useEffect, useState } from 'react';
import { AiOutlineFilter, AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { useNavigate, useLocation } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import API_BASE_URL from '../../js/urlHelper';

function FiltradoProductos({ onFilter }) {
  const [categorias, setCategorias] = useState([]);
  const [precioMaximo, setPrecioMaximo] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [filtro, setFiltro] = useState({
    texto: '',
    categoria: '',
    precioInicial: 0,
    precioFinal: 0,
    sort: ''
  });
  const [isOpen, setIsOpen] = useState(false);
  // Nueva bandera para rastrear si el usuario ha modificado el rango de precios
  const [precioModificado, setPrecioModificado] = useState(false);

  const sortOptions = [
    { value: '', label: 'Sin ordenar' },
    { value: 'az', label: 'A-Z' },
    { value: 'za', label: 'Z-A' },
    { value: 'price_asc', label: 'Precio: Menor a Mayor' },
    { value: 'price_desc', label: 'Precio: Mayor a Menor' }
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const texto = searchParams.get('texto') || '';
    const categoria = searchParams.get('categoria') || '';
    const precioInicial = parseFloat(searchParams.get('precioInicial')) || 0;
    const precioFinal = parseFloat(searchParams.get('precioFinal')) || precioMaximo;
    const sort = searchParams.get('sort') || '';

    // Si hay precios en la URL, marca como modificado
    if (searchParams.has('precioInicial') || searchParams.has('precioFinal')) {
      setPrecioModificado(true);
    }

    setFiltro({
      texto,
      categoria,
      precioInicial,
      precioFinal,
      sort
    });

    onFilter({
      texto,
      categoria,
      precioInicial,
      precioFinal,
      sort
    });
  }, [location.search, precioMaximo]);

  useEffect(() => {
    const obtenerPrecioMaximo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/obtenerPrecioMaximo`);
        const result = await response.json();

        if (result.success) {
          setPrecioMaximo(result.precioMaximo);
          setFiltro((prevFiltro) => ({
            ...prevFiltro,
            precioFinal: result.precioMaximo,
          }));
        } else {
          console.error('No se pudo obtener el precio máximo:', result.message);
        }
      } catch (error) {
        console.error('Error al obtener el precio máximo:', error);
      }
    };

    obtenerPrecioMaximo();
  }, []);

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
    setPrecioModificado(true);
    setFiltro((prevFiltro) => ({
      ...prevFiltro,
      precioInicial: value[0],
      precioFinal: value[1],
    }));
  };

  const handleApplyFilters = () => {
    const searchParams = new URLSearchParams();
    if (filtro.texto) searchParams.set('texto', filtro.texto);
    if (filtro.categoria) searchParams.set('categoria', filtro.categoria);
    if (filtro.sort) searchParams.set('sort', filtro.sort);
    
    // Solo incluye los precios en la URL si han sido modificados
    if (precioModificado) {
      searchParams.set('precioInicial', filtro.precioInicial);
      searchParams.set('precioFinal', filtro.precioFinal);
    }

    navigate(`/productos?${searchParams.toString()}`);
    onFilter(filtro);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setPrecioModificado(false);
    const resetFiltro = {
      texto: '',
      categoria: '',
      precioInicial: 0,
      precioFinal: precioMaximo,
      sort: ''
    };
    setFiltro(resetFiltro);
    onFilter(resetFiltro);
    setIsOpen(false);
    navigate('/productos');
  };
  
  return (
    <>
      {/* Botón para mostrar/ocultar el filtrador */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 bottom-4 z-[40] bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors md:p-4 md:right-6 md:bottom-6"
        aria-label="Toggle filters"
      >
        <AiOutlineFilter className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Fondo oscuro para móvil y PC */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Filtrador */}
      <aside className={`fixed top-0 right-0 h-full w-80 bg-white z-[1000] transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto md:w-96`}>
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Filtrar Productos</h2>
            <button onClick={() => setIsOpen(false)}>
              <AiOutlineClose className="w-6 h-6" />
            </button>
          </div>

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
                <option key={categoria.idCategoria} value={categoria.idCategoria}>
                  {categoria.nombreCategoria}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Rango de Precio</label>
            <div className="space-y-4">
              <Slider
                range
                min={0}
                max={precioMaximo}
                value={[filtro.precioInicial, filtro.precioFinal]}
                onChange={handlePriceChange}
                className="w-full"
              />
              <div className="text-sm text-gray-600 text-center">
                S/.{filtro.precioInicial} - S/.{filtro.precioFinal}
              </div>
            </div>
          </div>

           {/* New sorting option */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Ordenar por</label>
            <select
              name="sort"
              value={filtro.sort}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

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
      </aside>
    </>
  );
}

export default FiltradoProductos;