import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel } from '@tanstack/react-table';
import { deleteProduct, getProducts } from '../../api/api';
import { Edit, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

function AdminProducts() {
  const queryClient = useQueryClient()
  const {machineId} = useParams()
  const navigate = useNavigate()
  // Fetch products using React Query
  const { data: products, isLoading: fetchingProducts, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await getProducts(machineId);
      return response.data.data;
    },
  });

  const {data: deletedProduct, isPending:isDeleting, error:deleteError, mutate: deleteMutate} = useMutation({
    mutationFn: async (id) => {
      const res = await deleteProduct(id)
      console.log(res)
      return res
    }, onSuccess: async()=>{
      queryClient.invalidateQueries("products")
    }
  })

  // Define table columns
  const columns = useMemo(
    () => [
      {
        header: 'S.No.',
        accessorKey: 'sn',
        cell: (info) => info.row.index + 1,
        enableSorting: false,
      },
      {
        header: 'Image',
        accessorKey: 'image_url',
        cell: ({ row }) => (
          <img
            src={row.original.image_url}
            alt={`Image of ${row.original.name}`}
            className="w-16 h-16 object-cover"
          />
        ),
        enableSorting: false,
      },
      {
        header: 'Name',
        accessorKey: 'name',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Price',
        accessorKey: 'price',
        cell: (info) => `Rs. ${info.getValue()}`,
      },
      {
        header: 'Category',
        accessorKey: 'category',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Stock',
        accessorKey: 'stock',
        cell: (info) => info.getValue(),
        // enableSorting: false,
      },
      {
        header: 'Product Number',
        accessorKey: 'productNumber',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Active',
        accessorKey: 'active',
        cell: (info) => (info.getValue() ? 'Yes' : 'No'),
      },
      {
        header: 'Actions', 
        accessorKey: 'actions',
        cell: ({ row }) => (
          <div className="space-x-2">
            <button
              className="text-blue-500 hover:underline"
              onClick={() => navigate(`/admin/products/edit/${row.original._id}`)}
            >
              <Edit />
            </button>
            <button
              className="text-red-500 hover:underline"
              onClick={() => deleteMutate(row.original._id)} // Pass the ID to deleteMutate
            >
              <Trash2/>
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  // Initialize the table with sorting enabled for the specified columns
  const table = useReactTable({
    columns,
    data: products || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: 'name', desc: false }],
    },
  });

  if (fetchingProducts) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center">Products</h1>
      <button onClick={()=>navigate(`/admin/products/add/${machineId}`)}>
        Add Product
      </button>
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

export default AdminProducts;
