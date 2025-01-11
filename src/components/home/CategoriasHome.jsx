import React, { useEffect, useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../js/urlHelper';

const Categories = forwardRef((props, ref) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 8;
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/listarCategorias`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        console.error('Error en respuesta de la API:', data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/productos?categoria=${categoryId}`);
  };

  // Calcular el total de páginas
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  // Obtener las categorías de la página actual
  const getCurrentCategories = () => {
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    return categories.slice(indexOfFirstCategory, indexOfLastCategory);
  };

  // Manejar el cambio de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Usar un setTimeout para asegurar que el estado se haya actualizado antes de hacer scroll
    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  };

  return (
    <div className="bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Categorías</h2>
        <div className="relative">
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-start bg-white opacity-75 mt-1">
              <div className="w-16 h-16 border-4 border-t-4 border-gray-600 border-solid rounded-full animate-spin"></div>
            </div>
          ) : null}

          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${loading ? 'opacity-0' : 'opacity-100'}`}>
            {getCurrentCategories().map((category) => {
              const imageUrl = category.imagen 
                ? `${API_BASE_URL}/storage/${category.imagen}` 
                : '/img/default-product.png';
              
              return (
                <div
                  key={category.idCategoria}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
                  onClick={() => handleCategoryClick(category.idCategoria)}
                >
                  <img
                    src={imageUrl}
                    alt={category.nombreCategoria}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {category.nombreCategoria}
                    </h3>
                    {category.descripcion && (
                      <p className="text-gray-600">{category.descripcion}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paginación */}
          <div className="flex justify-center mt-8 items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-1 px-4 py-2 rounded-full bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &larr; Anterior
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-4 py-2 rounded-full ${
                  currentPage === index + 1
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="mx-1 px-4 py-2 rounded-full bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Categories;