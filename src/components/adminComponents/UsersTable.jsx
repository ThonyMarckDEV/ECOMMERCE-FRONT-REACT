import React, { useState } from 'react';

const UsersTable = () => {
  const initialData = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin', status: 'Activo' },
    { id: 2, name: 'Ana Gómez', email: 'ana@example.com', role: 'Usuario', status: 'Inactivo' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'Moderador', status: 'Activo' },
    { id: 4, name: 'Maria Torres', email: 'maria@example.com', role: 'Usuario', status: 'Inactivo' },
    { id: 5, name: 'Luis Martínez', email: 'luis@example.com', role: 'Admin', status: 'Activo' },
    { id: 6, name: 'Sofia Ramirez', email: 'sofia@example.com', role: 'Usuario', status: 'Activo' },
    { id: 7, name: 'Pedro Ruiz', email: 'pedro@example.com', role: 'Moderador', status: 'Inactivo' },
  ];

  const [userData, setUserData] = useState(initialData);

  const toggleStatus = (id) => {
    setUserData((prevData) =>
      prevData.map((user) =>
        user.id === id ? { ...user, status: user.status === 'Activo' ? 'Inactivo' : 'Activo' } : user
      )
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">ID</th>
            <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">Nombre</th>
            <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">Correo Electrónico</th>
            <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">Rol</th>
            <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">Estado</th>
            <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase border-b">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {userData.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 text-sm text-gray-700 border-b">{user.id}</td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">{user.name}</td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">{user.email}</td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">{user.role}</td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                <span
                  className={`cursor-pointer px-2 py-1 rounded-full text-white ${user.status === 'Activo' ? 'bg-green-500' : 'bg-red-500'}`}
                  onClick={() => toggleStatus(user.id)}
                >
                  {user.status}
                </span>
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                <div className="space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => alert(`Editar usuario con ID: ${user.id}`)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    onClick={() => alert(`Actualizar usuario con ID: ${user.id}`)}
                  >
                    Actualizar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
