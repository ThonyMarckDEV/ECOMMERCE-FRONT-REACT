import React from 'react';

const DashboardCard = () => {
  const dashboardData = [
    { title: 'Usuarios Activos', value: '1,245', description: 'Usuarios registrados en la plataforma', color: 'bg-blue-500' },
    { title: 'Marcas Registradas Totales', value: '12', description: 'Número de marcas asociadas: Adidas, Puma, etc.', color: 'bg-green-500' },
    { title: 'Errores del Sistema', value: '5', description: 'Alertas de errores críticos', color: 'bg-red-500' },
    { title: 'Visitantes Hoy', value: '8,435', description: 'Número de visitantes únicos', color: 'bg-purple-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 relative z-10">
      {dashboardData.map((item, index) => (
        <div
          key={index}
          className={`p-6 rounded-lg shadow-md text-white ${item.color} hover:shadow-lg transition-transform transform hover:-translate-y-2`}
        >
          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
          <p className="text-3xl font-bold mb-2">{item.value}</p>
          <p className="text-sm">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCard;
