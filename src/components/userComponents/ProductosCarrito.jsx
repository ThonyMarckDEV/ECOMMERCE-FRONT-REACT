function ProductosCarrito({ productos, actualizarCantidad, eliminarProducto, isLoading, API_BASE_URL }) {
  if (!Array.isArray(productos) || productos.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {productos.map((producto) => {
        if (!producto || !producto.idDetalle) {
          return null;
        }

        // Safely access properties with default values
        const precioOriginal = parseFloat(producto.precioOriginal || 0);
        const precioFinal = parseFloat(producto.precioFinal || 0);
        const subtotal = parseFloat(producto.subtotal || 0);
        const cantidad = parseInt(producto.cantidad || 1);
        const descuento = parseFloat(producto.descuento || 0);

        if (!producto.nombreProducto || !producto.urlImagen) {
          console.error("Producto missing required properties:", producto);
          return null;
        }

        if (isNaN(precioOriginal) || isNaN(precioFinal) || isNaN(subtotal)) {
          console.error("Precio o subtotal inválidos para el producto:", producto);
          return null;
        }

        const tieneDescuento = descuento > 0;
        
        const handleQuantityChange = async (newQuantity) => {
          if (newQuantity < 1) return;
          
          // Update UI optimistically
          const price = tieneDescuento ? precioFinal : precioOriginal;
          const estimatedSubtotal = price * newQuantity;
          
          // Create temporary updated product for immediate UI feedback
          const updatedProduct = {
            ...producto,
            cantidad: newQuantity,
            subtotal: estimatedSubtotal
          };
          
          // Call the actualizarCantidad function with the new quantity and the temporary product
          await actualizarCantidad(producto.idDetalle, newQuantity, updatedProduct);
        };

        return (
          <div key={producto.idDetalle} className="bg-white p-4 rounded-lg shadow-md w-full sm:w-80 md:w-96">
            <img
              src={`${API_BASE_URL}/storage/${producto.urlImagen}`}
              alt={producto.nombreProducto}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-black">{producto.nombreProducto}</h2>
            <p className="text-gray-600 text-sm mb-2">{producto.descripcion || 'Sin descripción'}</p>
            <p className="text-sm text-gray-600 mb-2">Modelo: {producto.nombreModelo || 'N/A'}</p>
            <p className="text-sm text-gray-600 mb-2">Talla: {producto.nombreTalla || 'N/A'}</p>
            <div className="flex justify-between items-center mb-4">
              {tieneDescuento ? (
                <>
                  <span className="text-lg font-medium text-black line-through">S/.{precioOriginal.toFixed(2)}</span>
                  <span className="text-lg font-medium text-red-600">S/.{precioFinal.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-lg font-medium text-black">S/.{precioOriginal.toFixed(2)}</span>
              )}
              <span className="text-sm text-gray-500">
                x {cantidad} = S/.{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center">
                <button
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
                  onClick={() => handleQuantityChange(cantidad - 1)}
                  disabled={isLoading || cantidad <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value);
                    if (!isNaN(newValue) && newValue >= 1) {
                      handleQuantityChange(newValue);
                    }
                  }}
                  className="mx-2 w-16 text-center border-2 border-gray-300 rounded-lg"
                  min="1"
                  disabled={isLoading}
                />
                <button
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
                  onClick={() => handleQuantityChange(cantidad + 1)}
                  disabled={isLoading}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                onClick={() => eliminarProducto(producto.idDetalle)}
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