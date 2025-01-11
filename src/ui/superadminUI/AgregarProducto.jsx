import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/superAdminComponents/SidebarSuperAdmin';
import SweetAlert from '../../components/SweetAlert';
import LoaderScreen from '../../components/home/LoadingScreen';
import API_BASE_URL from '../../js/urlHelper';
import { Upload, X } from 'lucide-react';
import jwtUtils from '../../utilities/jwtUtils';
import { TallasModal } from '../../components/superAdminComponents/TallasModal';

function AgregarProducto() {
  const initialProductState = {
    idProducto: '',
    nombreProducto: '',
    descripcion: '',
    estado: 'activo',
    idCategoria: ''
  };

  const initialModeloState = {
    idModelo: '',
    nombreModelo: '',
    imagen: null
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

  useEffect(() => {
    cargarCategorias();
    cargarTallas();
  }, []);

  const cargarCategorias = async () => {
    const token = jwtUtils.getTokenFromCookie();
    try {
      const response = await fetch(`${API_BASE_URL}/api/categoriasproductos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Error al cargar categorías');
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      SweetAlert.showMessageAlert('Error', 'Error al cargar categorías', 'error');
    }
  };

  const cargarTallas = async () => {
    const token = jwtUtils.getTokenFromCookie();
    try {
      const response = await fetch(`${API_BASE_URL}/api/tallas`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Error al cargar tallas');
      const data = await response.json();
      setTallas(data);
    } catch (error) {
      SweetAlert.showMessageAlert('Error', 'Error al cargar tallas', 'error');
    }
  };

  const resetForm = () => {
    setProducto(initialProductState);
    setModelos([initialModeloState]);
    setSelectedFiles([null]);
    setModeloTallas({});
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => input.value = '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto(prev => ({ ...prev, [name]: value }));
  };

  const handleModeloChange = (index, e) => {
    const { name, value } = e.target;
    setModelos(prev => prev.map((modelo, i) => 
      i === index ? { ...modelo, [name]: value } : modelo
    ));
  };

  const handleImagenChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        SweetAlert.showMessageAlert('Error', 'Por favor seleccione un archivo de imagen válido', 'error');
        e.target.value = '';
        return;
      }

      const newSelectedFiles = [...selectedFiles];
      newSelectedFiles[index] = URL.createObjectURL(file);
      setSelectedFiles(newSelectedFiles);
      
      setModelos(prev => prev.map((modelo, i) => 
        i === index ? { ...modelo, imagen: file } : modelo
      ));
    }
  };

  const handleTallaSelect = (talla) => {
    setSelectedTallas(prev => {
      const exists = prev.some(t => t.idTalla === talla.idTalla);
      if (exists) {
        setModeloTallas(prevModeloTallas => {
          const newModeloTallas = { ...prevModeloTallas };
          Object.keys(newModeloTallas).forEach(modeloIndex => {
            delete newModeloTallas[modeloIndex][talla.idTalla];
          });
          return newModeloTallas;
        });
        return prev.filter(t => t.idTalla !== talla.idTalla);
      } else {
        setModeloTallas(prevModeloTallas => {
          const newModeloTallas = { ...prevModeloTallas };
          modelos.forEach((_, index) => {
            if (!newModeloTallas[index]) {
              newModeloTallas[index] = {};
            }
            newModeloTallas[index][talla.idTalla] = 0;
          });
          return newModeloTallas;
        });
        return [...prev, talla];
      }
    });
  };

  const handleStockChange = (modeloIndex, tallaId, value) => {
    setModeloTallas(prev => ({
      ...prev,
      [modeloIndex]: {
        ...prev[modeloIndex],
        [tallaId]: parseInt(value) || 0
      }
    }));
  };

  const validateForm = () => {
    if (!producto.nombreProducto.trim()) {
      SweetAlert.showMessageAlert('Error', 'El nombre del producto es obligatorio', 'error');
      return false;
    }

    if (!producto.idCategoria) {
      SweetAlert.showMessageAlert('Error', 'Debe seleccionar una categoría', 'error');
      return false;
    }

    if (modelos.length === 0) {
      SweetAlert.showMessageAlert('Error', 'Debe agregar al menos un modelo', 'error');
      return false;
    }

    for (let i = 0; i < modelos.length; i++) {
      if (!modelos[i].nombreModelo.trim()) {
        SweetAlert.showMessageAlert('Error', `El nombre del modelo ${i + 1} es obligatorio`, 'error');
        return false;
      }

      if (!modelos[i].imagen) {
        SweetAlert.showMessageAlert('Error', `Debe seleccionar una imagen para el modelo ${i + 1}`, 'error');
        return false;
      }
    }

    return true;
  };

  const agregarNuevoModelo = () => {
    setModelos(prev => [...prev, initialModeloState]);
    setSelectedFiles(prev => [...prev, null]);
    // Initialize stock for new model
    setModeloTallas(prev => {
      const newModeloTallas = { ...prev };
      const newModeloIndex = modelos.length;
      newModeloTallas[newModeloIndex] = {};
      selectedTallas.forEach(talla => {
        newModeloTallas[newModeloIndex][talla.idTalla] = 0;
      });
      return newModeloTallas;
    });
  };

  const eliminarModelo = (index) => {
    setModelos(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setModeloTallas(prev => {
      const newModeloTallas = { ...prev };
      delete newModeloTallas[index];
      // Reindex remaining models
      const reindexedTallas = {};
      Object.keys(newModeloTallas)
        .filter(key => parseInt(key) > index)
        .forEach(key => {
          reindexedTallas[parseInt(key) - 1] = newModeloTallas[key];
        });
      return reindexedTallas;
    });
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
  
    modelos.forEach((modelo, index) => {
      formData.append(`modelos[${index}][nombreModelo]`, modelo.nombreModelo.trim());
      formData.append(`modelos[${index}][imagen]`, modelo.imagen);
      // Add stock information
      if (modeloTallas[index]) {
        Object.entries(modeloTallas[index]).forEach(([tallaId, stock]) => {
          formData.append(`modelos[${index}][tallas][${tallaId}]`, stock);
        });
      }
    });
  
    try {
      const token = jwtUtils.getTokenFromCookie();
      const response = await fetch(`${API_BASE_URL}/api/agregarProductos`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Error al agregar el producto');
      }
      
      SweetAlert.showMessageAlert('Éxito', 'Producto agregado correctamente', 'success');
      resetForm();
    } catch (error) {
      console.error('Error en la respuesta del servidor:', error.message);
      SweetAlert.showMessageAlert('Error', error.message, 'error');
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
                <label className="text-sm font-medium text-gray-700">Categoría</label>
                <select
                  name="idCategoria"
                  value={producto.idCategoria}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map(categoria => (
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

            <div className="border-t pt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Tallas del Producto</h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 transition"
                >
                  Agregar Tallas
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedTallas.map((talla) => (
                  <div key={talla.idTalla} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{talla.nombreTalla}</span>
                      <button
                        type="button"
                        onClick={() => handleTallaSelect(talla)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <TallasModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              tallas={tallas}
              selectedTallas={selectedTallas}
              onTallaSelect={handleTallaSelect}
            />

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
                        <div className="relative">
                          <input
                            type="file"
                            name="imagen"
                            onChange={(e) => handleImagenChange(index, e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            id={`imagen-${index}`}
                            accept="image/*"
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
                                  Click para seleccionar imagen
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                        {/* Agregar la sección de stock por tallas aquí */}
                        {selectedTallas.length > 0 && (
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Stock por Talla</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {selectedTallas.map((talla) => (
                                <div key={talla.idTalla} className="space-y-1">
                                  <label className="text-sm text-gray-600">{talla.nombreTalla}</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={modeloTallas[index]?.[talla.idTalla] || 0}
                                    onChange={(e) => handleStockChange(index, talla.idTalla, e.target.value)}
                                    className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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