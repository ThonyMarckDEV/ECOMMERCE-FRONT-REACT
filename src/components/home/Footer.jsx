import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Parte superior del footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sobre nosotros</h3>
            <p className="text-gray-400">
              Somos una tienda de ropa minimalista enfocada en calidad y estilo. Encuentra prendas únicas para todos los gustos.
            </p>
          </div>

          {/* Columna 2 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <a href="#camisetas" className="hover:text-gray-400">Camisetas</a>
              </li>
              <li>
                <a href="#pantalones" className="hover:text-gray-400">Pantalones</a>
              </li>
              <li>
                <a href="#zapatos" className="hover:text-gray-400">Zapatos</a>
              </li>
              <li>
                <a href="#accesorios" className="hover:text-gray-400">Accesorios</a>
              </li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contáctanos</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:info@tienda.com" className="hover:text-gray-400">info@tienda.com</a>
              </li>
              <li>
                <a href="tel:+123456789" className="hover:text-gray-400">+1 234 567 89</a>
              </li>
              <li>
                <p className="text-gray-400">Lunes a Viernes: 9 AM - 6 PM</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <hr className="border-gray-700 my-8" />

        {/* Parte inferior del footer */}
        <div className="flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} ECOMMERCE. Todos los derechos reservados.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#facebook" className="hover:text-white">Facebook</a>
            <a href="#instagram" className="hover:text-white">Instagram</a>
            <a href="#twitter" className="hover:text-white">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
