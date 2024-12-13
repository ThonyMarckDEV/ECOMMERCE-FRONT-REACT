import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir
import API_BASE_URL from '../../js/urlHelper';

const CategoriesGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook para navegar

  // Función para obtener las categorías desde la API
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/listarCategorias`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar la función fetchCategories al montar el componente
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    // Redirige a la página de productos, filtrando por la categoría
    navigate(`/productos?categoria=${categoryId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Categorías</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.idCategoria}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
              onClick={() => handleCategoryClick(category.idCategoria)} // Evento para redirigir
            >
              <img
                src={category.imagen ? `${API_BASE_URL}/${category.imagen}` : '/img/default-product.png'}
                alt={category.nombreCategoria}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{category.nombreCategoria}</h3>
                {category.descripcion && <p className="text-gray-600">{category.descripcion}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesGrid;
