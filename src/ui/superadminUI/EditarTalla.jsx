import Sidebar from '../../components/adminComponents/Sidebar';
import TallaTable from '../../components/adminComponents/TallaTable';

function Editartalla() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Lista de Tallas</h2>
        <div className="overflow-x-auto">
          <TallaTable />
        </div>
      </div>

    </div>
  );
}

export default Editartalla;
