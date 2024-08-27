import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel } from '@tanstack/react-table';
import { getPaidCartsByMachine } from '../../api/api';
import { useParams } from 'react-router-dom';

function GetPaidCarts() {
  const { machineId } = useParams();

  const columns = useMemo(
    () => [

      {
        header: 'S.No.',
        accessorKey: 'serialNumber',
        cell: (info) => info.row.index + 1,
        enableSorting: false,
      },
      {
        header: 'Product Name',
        accessorKey: 'productId.name',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Quantity',
        accessorKey: 'quantity',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Price',
        accessorKey: 'productId.price',
        cell: (info) => `Rs. ${info.getValue().toFixed(2)}`,
      },
      {
        header: 'Total Amount',
        accessorKey: 'totalAmount',
        cell: (info) => {
          const quantity = info.row.original.quantity;
          const price = info.row.original.productId.price;
          return `Rs. ${(quantity * price).toFixed(2)}`;
        },
        sortingFn: 'basic',
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
        cell: (info) => new Date(info.getValue()).toLocaleString(),
      },
      {
        header: 'Updated At',
        accessorKey: 'updatedAt',
        cell: (info) => new Date(info.getValue()).toLocaleString(),
      },
    ],
    []
  );

  const { data: paid_carts, isLoading, error } = useQuery({
    queryKey: ['paid_carts', machineId],
    queryFn: async () => {
      const response = await getPaidCartsByMachine(machineId);
      return response.data.data;
    },
    initialData: [],
  });

  const table = useReactTable({
    columns,
    data: paid_carts || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { sorting: [{ id: 'createdAt', desc: true }] },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4 bg-gray-300">
      <h1 className="text-2xl font-bold mb-6 text-center">Paid Carts</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left py-3 px-4 font-semibold text-gray-600 cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted()] || null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-3 px-4 border-t">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GetPaidCarts;
