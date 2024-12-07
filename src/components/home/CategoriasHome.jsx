import React from 'react';

// IMÁGENES LOCALES PARA LAS CATEGORÍAS
import camisetasImage from '../../img/camisetas.webp';
import pantalonesImage from '../../img/pantalones.webp';
import zapatosImage from '../../img/zapatos.webp';
import accesoriosImage from '../../img/accesorios.webp';
import abrigosImage from '../../img/abrigos.webp';
import deportivaImage from '../../img/deportiva.webp';

const CategoriesGrid = () => {
  const categories = [
    { name: 'Camisetas', image: camisetasImage },
    { name: 'Pantalones', image: pantalonesImage },
    { name: 'Zapatos', image: zapatosImage },
    { name: 'Accesorios', image: accesoriosImage },
    { name: 'Abrigos', image: abrigosImage },
    { name: 'Deportiva', image: deportivaImage },
  ];

  return (
    <div className="bg-white">
        <div className="max-w-7xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Categorías</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
            <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
                <img src={category.image} alt={category.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                </div>
            </div>
            ))}
        </div>
        </div>
  </div>
  );
};

export default CategoriesGrid;
