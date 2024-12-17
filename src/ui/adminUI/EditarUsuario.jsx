// AdminUI.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/adminComponents/Sidebar';  // Importamos el sidebar
import UsersTable from '../../components/adminComponents/UsersTable';  // Importamos la tabla de usuarios

function EditarUsuario() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Aquí debes obtener los usuarios, puede ser una llamada a una API o datos estáticos.
    // Este es solo un ejemplo de datos estáticos
    const fetchUsers = async () => {
      const usersData = [
        { id: 1, name: 'Juan Pérez', email: 'juan@example.com', registrationDate: '2023-11-01' },
        { id: 2, name: 'Ana Gómez', email: 'ana@example.com', registrationDate: '2023-11-05' },
        { id: 3, name: 'Carlos López', email: 'carlos@example.com', registrationDate: '2023-10-20' },
      ];
      setUsers(usersData);
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />  {/* Llamamos al Sidebar */}
      <div className="flex-1 p-8 bg-gray-100"> {/* El contenido principal ocupa el espacio restante */}
        <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>
        <UsersTable data={users} /> {/* Pasamos los usuarios a la tabla */}
      </div>
    </div>
  );
}

export default EditarUsuario;
