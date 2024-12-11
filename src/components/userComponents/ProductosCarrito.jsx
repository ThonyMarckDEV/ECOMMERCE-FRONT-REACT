import React from 'react';

function ProductosCarrito({ productos, actualizarCantidad, eliminarProducto, isLoading, API_BASE_URL }) {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {productos.map((producto) => {
        // Aseguramos que precio y subtotal sean números válidos
        const precio = parseFloat(producto.precio);
        const subtotal = parseFloat(producto.subtotal);

        // Verificamos si precio y subtotal son números válidos
        if (isNaN(precio) || isNaN(subtotal)) {
          console.error("Precio o subtotal inválidos para el producto:", producto);
          return null; // O puedes mostrar un valor por defecto
        }

        return (
          <div key={producto.idDetalle} className="bg-white p-4 rounded-lg shadow-md w-full sm:w-80 md:w-96">
            <img
              src={`${API_BASE_URL}/storage/${producto.urlImagen}`}
              alt={producto.nombreProducto}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-black">{producto.nombreProducto}</h2>
            <p className="text-gray-600 text-sm mb-2">{producto.descripcion}</p>
            <p className="text-sm text-gray-600 mb-2">Modelo: {producto.nombreModelo}</p>
            <p className="text-sm text-gray-600 mb-2">Talla: {producto.nombreTalla}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-black">S/.{precio.toFixed(2)}</span>
              <span className="text-sm text-gray-500">
                x {producto.cantidad} = S/.{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center">
                <button
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  onClick={() => actualizarCantidad(producto.idDetalle, producto.cantidad - 1)}
                  disabled={isLoading}
                >
                  -
                </button>
                <input
                  type="number"
                  value={producto.cantidad}
                  onChange={(e) =>
                    actualizarCantidad(producto.idDetalle, parseInt(e.target.value) || 1)
                  }
                  className="mx-2 w-16 text-center border-2 border-gray-300 rounded-lg"
                  min="1"
                  disabled={isLoading}
                />
                <button
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  onClick={() => actualizarCantidad(producto.idDetalle, producto.cantidad + 1)}
                  disabled={isLoading}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={() => eliminarProducto(producto.idDetalle)} // Usamos idDetalle aquí
                disabled={isLoading}
              >
                Eliminar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductosCarrito;