// components/adminComponents/UsersTable.jsx
import React from 'react';
import { useTable } from 'react-table';

const UsersTable = ({ data }) => {
  // Definir las columnas de la tabla
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id', // Clave para acceder a los datos
      },
      {
        Header: 'Nombre',
        accessor: 'name',
      },
      {
        Header: 'Correo Electrónico',
        accessor: 'email',
      },
      {
        Header: 'Fecha de Registro',
        accessor: 'registrationDate',
      },
    ],
    []
  );

  // Usar el hook useTable para crear la tabla
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table {...getTableProps()} className="min-w-full table-auto">
        <thead className="bg-gray-200">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  className="px-6 py-3 text-left text-sm font-medium text-gray-500"
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="border-b">
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()} className="px-6 py-4 text-sm text-gray-700">
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
