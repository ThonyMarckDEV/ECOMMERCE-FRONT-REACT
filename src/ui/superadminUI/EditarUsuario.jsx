import Sidebar from '../../components/superAdminComponents/SidebarSuperAdmin';
import UsersTable from '../../components/superAdminComponents/UsersTable';

function EditarUsuario() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>
        <div className="overflow-x-auto">
          <UsersTable />
        </div>
      </div>

    </div>
  );
}

export default EditarUsuario;
