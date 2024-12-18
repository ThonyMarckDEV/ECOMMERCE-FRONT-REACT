import React from 'react';
import Sidebar from '../../components/adminComponents/Sidebar';
import DashboardCard from '../../components/adminComponents/DashboardCard'; // Llamamos al componente de Cards

function AdminUI() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <h2 className="text-3xl font-bold mb-6">¡Bienvenido al Panel de Administración!</h2>
        
        {/* Dashboard con Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard />
        </div>
      </div>
    </div>
  );
}

export default AdminUI;
