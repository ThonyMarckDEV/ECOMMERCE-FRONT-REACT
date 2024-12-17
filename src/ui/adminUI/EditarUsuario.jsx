// AdminUI.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/adminComponents/Sidebar';
import UsersTable from '../../components/adminComponents/UsersTable';

function EditarUsuario() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Simulación de datos de usuarios, puedes reemplazar esto con una llamada a API.
    const fetchUsers = async () => {
      const usersData = [
        { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin', status: 'Activo' },
        { id: 2, name: 'Ana Gómez', email: 'ana@example.com', role: 'Usuario', status: 'Inactivo' },
        { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'Moderador', status: 'Activo' },
      ];
      setUsers(usersData);
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>
        <UsersTable data={users} />
      </div>
    </div>
  );
}

export default EditarUsuario;
