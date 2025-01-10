import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../js/urlHelper';
import Pagination from './Pagination';

const CategoriesGrid = () => {
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
  };

  return (
    <div className="bg-white">
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

          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesGrid;