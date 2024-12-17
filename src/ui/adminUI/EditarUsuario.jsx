import Sidebar from '../../components/adminComponents/Sidebar';
import UsersTable from '../../components/adminComponents/UsersTable';

function EditarUsuario() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>
        {/* Contenedor con scroll horizontal para la tabla */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <UsersTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditarUsuario;
