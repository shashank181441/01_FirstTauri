import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/Input'; // Adjust the import path if necessary
import { createProduct } from '../../api/api';

function AdminProductAdd() {
  const methods = useForm({
    defaultValues: {
      name: 'Cococola',
      price: '2',
      image_url: '',
      productNumber: '',
      active: false,
    },
  });

  const navigate = useNavigate();
  const { machineId } = useParams();

  const onSubmit = async (formData) => {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    data.append('price', formData.price);
    data.append('productNumber', formData.productNumber);
    data.append('active', formData.active ? 'true' : 'false');
    if (formData.image_url && formData.image_url[0]) {
      data.append('image_url', formData.image_url[0]);
    }
    data.append('machineId', machineId);

    const response = await createProduct(data);
    console.log(response.data.data);
    navigate(`/admin/products/${machineId}`);
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Product Add</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <Input label="Name" name="name" required />
          <div>
            <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
              Category
            </label>
            <div className="mt-2">
              <select
                id="category"
                {...methods.register('category')}
                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="beverages">Beverages</option>
                <option value="snacks">Snacks</option>
                <option value="chocolate">Chocolate</option>
              </select>
            </div>
          </div>
          <Input label="Stock" name="stock" type="number" />
          <Input label="Price" name="price" type="text" />
          <Input label="Product Number" name="productNumber" type="text" />
          <div>
            <label htmlFor="active" className="block text-sm font-medium leading-6 text-gray-900">
              Active
            </label>
            <div className="mt-2 flex items-center">
              <input
                id="active"
                type="checkbox"
                {...methods.register('active')}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
          </div>
          <Input label="Image" name="image_url" type="file" />

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
          >
            Submit
          </button>
        </form>
      </FormProvider>
    </div>
  );
}

export default AdminProductAdd;
