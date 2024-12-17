// components/adminComponents/UsersTable.jsx
import React, { useState } from 'react';
import { useTable } from 'react-table';

const UsersTable = ({ data }) => {
  const [userData, setUserData] = useState(data);

  // Función para cambiar el estado de Activo/Inactivo
  const toggleStatus = (id) => {
    setUserData((prevData) =>
      prevData.map((user) =>
        user.id === id ? { ...user, status: user.status === 'Activo' ? 'Inactivo' : 'Activo' } : user
      )
    );
  };

  // Función de ejemplo para los botones de editar/actualizar
  const handleAction = (action, id) => {
    alert(`Acción: ${action} para el usuario con ID: ${id}`);
  };

  const columns = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Nombre', accessor: 'name' },
      { Header: 'Correo Electrónico', accessor: 'email' },
      { Header: 'Rol', accessor: 'role' },
      {
        Header: 'Estado',
        accessor: 'status',
        Cell: ({ row }) => (
          <span
            className={`cursor-pointer px-2 py-1 rounded-full text-white ${
              row.original.status === 'Activo' ? 'bg-green-500' : 'bg-red-500'
            }`}
            onClick={() => toggleStatus(row.original.id)}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        Header: 'Acciones',
        Cell: ({ row }) => (
          <div className="space-x-2">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={() => handleAction('Editar', row.original.id)}
            >
              Editar
            </button>
            <button
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              onClick={() => handleAction('Actualizar', row.original.id)}
            >
              Actualizar
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: userData,
  });

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table {...getTableProps()} className="min-w-full table-auto">
        <thead className="bg-gray-200">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase"
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="px-6 py-4 text-sm text-gray-700">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
