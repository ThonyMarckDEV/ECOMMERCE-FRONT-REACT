import Sidebar from '../../components/superAdminComponents/SidebarSuperAdmin';
import ProductTable from '../../components/superAdminComponents/ProductTable';

function EditarProducto() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100 overflow-auto">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">Lista de Productos</h2>
        <div className="overflow-x-auto">
          <ProductTable />
        </div>
      </div>

    </div>
  );
}

export default EditarProducto;
