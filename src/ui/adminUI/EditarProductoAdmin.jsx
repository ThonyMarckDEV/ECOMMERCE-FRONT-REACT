import Sidebar from '../../components/adminComponents/SidebarAdmin';
import ProductTableAdmin from '../../components/adminComponents/ProductTableAdmin';

function EditarProducto() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100 overflow-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Lista de Productos</h2>
        <div className="overflow-x-auto">
          <ProductTableAdmin />
        </div>
      </div>

    </div>
  );
}

export default EditarProducto;
