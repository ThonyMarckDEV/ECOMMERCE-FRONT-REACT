import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/superAdminComponents/SidebarSuperAdmin';
import SweetAlert from '../../components/SweetAlert';
import LoaderScreen from '../../components/home/LoadingScreen';
import API_BASE_URL from '../../js/urlHelper';
import { Upload, X } from 'lucide-react';
import jwtUtils from '../../utilities/jwtUtils';

function AgregarProducto() {
  const initialProductState = {
    idProducto: '',
    nombreProducto: '',
    descripcion: '',
    estado: 'activo',
    idCategoria: '',
    precio: '',
  };

  const initialModeloState = {
    idModelo: '',
    nombreModelo: '',
    imagen: null,
  };

  const [producto, setProducto] = useState(initialProductState);
  const [modelos, setModelos] = useState([initialModeloState]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([null]);
  const [tallas, setTallas] = useState([]);
  const [selectedTallas, setSelectedTallas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modeloTallas, setModeloTallas] = useState({});
  const [modeloSelectedTallas, setModeloSelectedTallas] = useState({});

  useEffect(() => {
    cargarCategorias();
    cargarTallas();
    setModeloSelectedTallas({ 0: [] });
  }, []);

  const cargarCategorias = async () => {
    const token = jwtUtils.getTokenFromCookie();
    try {
      const response = await fetch(`${API_BASE_URL}/api/categoriasproductos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar categorías');
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      SweetAlert.showMessageAlert('Error', 'Error al cargar categorías', 'error');
    }
  };

  const handleTallaSelect = (modeloIndex, talla) => {
    setModeloSelectedTallas((prev) => {
      const modelTallas = prev[modeloIndex] || [];
      const exists = modelTallas.some((t) => t.idTalla === talla.idTalla);
      const updatedTallas = exists
        ? modelTallas.filter((t) => t.idTalla !== talla.idTalla)
        : [...modelTallas, talla];
      return {
        ...prev,
        [modeloIndex]: updatedTallas,
      };
    });

    setModeloTallas((prev) => {
      const modeloStock = prev[modeloIndex] || {};
      if (modeloStock[talla.idTalla]) {
        const { [talla.idTalla]: removed, ...rest } = modeloStock;
        return {
          ...prev,
          [modeloIndex]: rest,
        };
      } else {
        return {
          ...prev,
          [modeloIndex]: {
            ...modeloStock,
            [talla.idTalla]: 0,
          },
        };
      }
    });
  };

  const agregarNuevoModelo = () => {
    const newIndex = modelos.length;
    setModelos((prev) => [...prev, initialModeloState]);
    setSelectedFiles((prev) => [...prev, null]);
    setModeloSelectedTallas((prev) => ({
      ...prev,
      [newIndex]: [],
    }));
  };

  const eliminarModelo = (index) => {
    setModelos((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setModeloSelectedTallas((prev) => {
      const { [index]: removed, ...rest } = prev;
      const reindexed = {};
      Object.entries(rest).forEach(([key, value]) => {
        const newKey = parseInt(key) > index ? parseInt(key) - 1 : key;
        reindexed[newKey] = value;
      });
      return reindexed;
    });
    setModeloTallas((prev) => {
      const { [index]: removed, ...rest } = prev;
      const reindexed = {};
      Object.entries(rest).forEach(([key, value]) => {
        const newKey = parseInt(key) > index ? parseInt(key) - 1 : key;
        reindexed[newKey] = value;
      });
      return reindexed;
    });
  };

  const cargarTallas = async () => {
    const token = jwtUtils.getTokenFromCookie();
    try {
      const response = await fetch(`${API_BASE_URL}/api/tallas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar tallas');
      const data = await response.json();
      setTallas(data);
    } catch (error) {
      SweetAlert.showMessageAlert('Error', 'Error al cargar tallas', 'error');
    }
  };

  const resetForm = () => {
    setProducto(initialProductState); // Reinicia el estado del producto
    setModelos([initialModeloState]); // Reinicia los modelos
    setSelectedFiles([null]); // Reinicia los archivos seleccionados
    setModeloTallas({}); // Reinicia las tallas de los modelos
    setModeloSelectedTallas({ 0: [] }); // Reinicia las tallas seleccionadas
  
    // Limpia los inputs de tipo file
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => (input.value = ''));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({ ...prev, [name]: value }));
  };

  const handleModeloChange = (index, e) => {
    const { name, value } = e.target;
    setModelos((prev) =>
      prev.map((modelo, i) =>
        i === index ? { ...modelo, [name]: value } : modelo
      )
    );
  };

  const handleImagenChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        SweetAlert.showMessageAlert(
          'Error',
          'Por favor seleccione un archivo de imagen válido',
          'error'
        );
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        SweetAlert.showMessageAlert(
          'Error',
          'El archivo no debe exceder los 5 MB',
          'error'
        );
        e.target.value = '';
        return;
      }

      const newSelectedFiles = [...selectedFiles];
      newSelectedFiles[index] = URL.createObjectURL(file);
      setSelectedFiles(newSelectedFiles);

      setModelos((prev) =>
        prev.map((modelo, i) =>
          i === index ? { ...modelo, imagen: file } : modelo
        )
      );
    }
  };

  const handleDrop = (index, e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        SweetAlert.showMessageAlert(
          'Error',
          'Por favor seleccione un archivo de imagen válido',
          'error'
        );
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        SweetAlert.showMessageAlert(
          'Error',
          'El archivo no debe exceder los 5 MB',
          'error'
        );
        return;
      }

      const newSelectedFiles = [...selectedFiles];
      newSelectedFiles[index] = URL.createObjectURL(file);
      setSelectedFiles(newSelectedFiles);

      setModelos((prev) =>
        prev.map((modelo, i) =>
          i === index ? { ...modelo, imagen: file } : modelo
        )
      );
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleStockChange = (modeloIndex, tallaId, value) => {
    setModeloTallas((prev) => ({
      ...prev,
      [modeloIndex]: {
        ...prev[modeloIndex],
        [tallaId]: value === '' ? '' : parseInt(value) || 0,
      },
    }));
  };

  const validateForm = () => {
    if (!producto.nombreProducto.trim()) {
      SweetAlert.showMessageAlert(
        'Error',
        'El nombre del producto es obligatorio',
        'error'
      );
      return false;
    }

    if (!producto.idCategoria) {
      SweetAlert.showMessageAlert(
        'Error',
        'Debe seleccionar una categoría',
        'error'
      );
      return false;
    }

    if (!producto.precio || producto.precio <= 0) {
      SweetAlert.showMessageAlert(
        'Error',
        'El precio debe ser mayor a 0',
        'error'
      );
      return false;
    }

    if (modelos.length === 0) {
      SweetAlert.showMessageAlert(
        'Error',
        'Debe agregar al menos un modelo',
        'error'
      );
      return false;
    }

    for (let i = 0; i < modelos.length; i++) {
      if (!modelos[i].nombreModelo.trim()) {
        SweetAlert.showMessageAlert(
          'Error',
          `El nombre del modelo ${i + 1} es obligatorio`,
          'error'
        );
        return false;
      }

      if (!modelos[i].imagen) {
        SweetAlert.showMessageAlert(
          'Error',
          `Debe seleccionar una imagen para el modelo ${i + 1}`,
          'error'
        );
        return false;
      }

      const modeloStock = modeloTallas[i] || {};
      const tallasSeleccionadas = modeloSelectedTallas[i] || [];

      for (const talla of tallasSeleccionadas) {
        const stock = modeloStock[talla.idTalla];
        if (stock === undefined || stock <= 0) {
          SweetAlert.showMessageAlert(
            'Error',
            `Debe ingresar un stock mayor a 0 para la talla ${talla.nombreTalla} en el modelo ${i + 1}`,
            'error'
          );
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    setLoading(true);
  
    const formData = new FormData();
    formData.append('nombreProducto', producto.nombreProducto.trim());
    formData.append('descripcion', producto.descripcion.trim());
    formData.append('estado', producto.estado);
    formData.append('idCategoria', producto.idCategoria);
    formData.append('precio', producto.precio);
  
    modelos.forEach((modelo, index) => {
      formData.append(`modelos[${index}][nombreModelo]`, modelo.nombreModelo.trim());
      formData.append(`modelos[${index}][imagen]`, modelo.imagen);
  
      const modeloStock = modeloTallas[index] || {};
      Object.entries(modeloStock).forEach(([tallaId, cantidad]) => {
        formData.append(`modelos[${index}][tallas][${tallaId}]`, cantidad);
      });
    });
  
    try {
      const token = jwtUtils.getTokenFromCookie();
      const response = await fetch(`${API_BASE_URL}/api/agregarProductos`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.text(); // Captura la respuesta como texto
        console.error('Error en la respuesta del servidor:', errorData);
        throw new Error('Error en la respuesta del servidor');
      }
  
      const data = await response.json();
  
      SweetAlert.showMessageAlert(
        'Éxito',
        'Producto agregado correctamente',
        'success'
      );
      resetForm(); // Limpia el formulario después de agregar el producto
    } catch (error) {
      console.error('Error en la respuesta del servidor:', error.message);
      SweetAlert.showMessageAlert('Error', error.message, 'error');
      resetForm(); // Limpia el formulario en caso de error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoaderScreen />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Agregar Producto</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Campos del producto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nombre del Producto</label>
                <input
                  type="text"
                  name="nombreProducto"
                  value={producto.nombreProducto}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Ingrese el nombre del producto"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={producto.precio}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Ingrese el precio del producto"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Categoría</label>
                <select
                  name="idCategoria"
                  value={producto.idCategoria}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.idCategoria} value={categoria.idCategoria}>
                      {categoria.nombreCategoria}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Descripción (Opcional) (Max. 60 Caracteres)
                </label>
                <textarea
                  name="descripcion"
                  value={producto.descripcion}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  rows="4"
                  placeholder="Descripción detallada del producto"
                  maxLength={60}
                />
                <div className="text-right text-xs text-gray-500">
                  {producto.descripcion.length}/60 caracteres
                </div>
              </div>
            </div>

            {/* Modelos del producto */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Modelos del Producto</h2>
              <div className="space-y-6">
                {modelos.map((modelo, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-800">Modelo {index + 1}</h3>
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => eliminarModelo(index)}
                          className="text-red-500 hover:text-red-600 transition"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Nombre del Modelo</label>
                        <input
                          type="text"
                          name="nombreModelo"
                          value={modelo.nombreModelo}
                          onChange={(e) => handleModeloChange(index, e)}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="Nombre del modelo"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Imagen del Modelo</label>
                        <div
                          className="relative"
                          onDrop={(e) => handleDrop(index, e)}
                          onDragOver={handleDragOver}
                        >
                          <input
                            type="file"
                            name="imagen"
                            onChange={(e) => handleImagenChange(index, e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            id={`imagen-${index}`}
                            accept=".jpeg, .jpg, .png, .avif, .webp"
                          />
                          <div
                            className={`flex items-center justify-center w-full p-3 border-2 border-dashed 
                              ${selectedFiles[index] ? 'border-green-500' : 'border-gray-300'} 
                              rounded-lg cursor-pointer hover:border-blue-500 transition`}
                          >
                            {selectedFiles[index] ? (
                              <div className="relative w-full">
                                <img
                                  src={selectedFiles[index]}
                                  alt="Preview"
                                  className="h-32 mx-auto object-contain"
                                />
                                <span className="mt-2 block text-sm text-center text-green-600">
                                  Imagen seleccionada - Click para cambiar
                                </span>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <span className="mt-2 block text-sm text-gray-600">
                                  Arrastra y suelta una imagen o haz clic para seleccionar
                                </span>
                                <span className="block text-xs text-gray-500">
                                  Formatos permitidos: .jpeg, .jpg, .png, .avif, .webp (Max. 5 MB)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 md:col-span-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Tallas para este modelo</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {tallas.map((talla) => {
                            const isSelected = modeloSelectedTallas[index]?.some(
                              (t) => t.idTalla === talla.idTalla
                            );
                            return (
                              <div
                                key={talla.idTalla}
                                className={`p-2 rounded border cursor-pointer ${
                                  isSelected ? 'bg-blue-100 border-blue-500' : 'border-gray-200'
                                }`}
                                onClick={() => handleTallaSelect(index, talla)}
                              >
                                <div className="flex justify-between items-center">
                                  <span>{talla.nombreTalla}</span>
                                  {isSelected && (
                                    <input
                                      type="number"
                                      min="0"
                                      value={modeloTallas[index]?.[talla.idTalla] ?? ''}
                                      onChange={(e) => handleStockChange(index, talla.idTalla, e.target.value)}
                                      onBlur={(e) => {
                                        if (e.target.value === '') {
                                          handleStockChange(index, talla.idTalla, 0);
                                        }
                                      }}
                                      className="w-20 p-1 border rounded"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={agregarNuevoModelo}
                  className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
                >
                  <Upload className="h-5 w-5" />
                  Agregar Nuevo Modelo
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full p-4 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition font-medium"
            >
              Agregar Producto
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AgregarProducto;