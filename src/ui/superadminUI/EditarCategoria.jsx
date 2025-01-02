import Sidebar from '../../components/superAdminComponents/SidebarSuperAdmin';
import CategoryTable from '../../components/superAdminComponents/CategoryTable';

function EditarCategoria() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Lista de Categorias</h2>
        <div className="overflow-x-auto">
          <CategoryTable />
        </div>
      </div>

    </div>
  );
}

export default EditarCategoria;
