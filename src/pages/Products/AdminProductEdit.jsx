import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { getProductDetails, updateProduct } from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';

function AdminProductEditcopy() {
    const [name, setName] = useState(''); // Default to empty string
    const [category, setCategory] = useState('beverages'); // Default to first category
    const [stock, setStock] = useState(0); // Default to 0
    const [price, setPrice] = useState(''); // Default to empty string
    const [productNumber, setProductNumber] = useState(''); // Default to empty string
    const [active, setActive] = useState(false); // Default to false

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { productId } = useParams();

    const { data: product, isLoading, error, isSuccess } = useQuery({
        queryKey: ['product', productId],
        queryFn: async () => {
            const response = await getProductDetails(productId);
            return response.data.data;
        }
    });

    const { mutate } = useMutation({
        mutationFn: async () => {
            const response = await updateProduct(productId, { name, category, stock, price, active: `${active}`, productNumber });
            console.log(response.data.data, active);
            return response.data.data;
        },
        onSuccess: () => {
            navigate(`/admin/products/${product?.machine}`);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    useEffect(() => {
        if (isSuccess && product) {
            setName(product.name || '');
            setCategory(product.category || 'beverages');
            setStock(product.stock || 0);
            setPrice(product.price || '');
            setActive(product.active || false);
            setProductNumber(product.productNumber || '');
        }
    }, [isSuccess, product]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Product Edit</h1>
            <form
                method="post"
                onSubmit={(e) => {
                    e.preventDefault();
                    mutate();
                }}
                className="space-y-4"
            >
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="beverages">Beverages</option>
                        <option value="snacks">Snacks</option>
                        <option value="chocolate">Chocolate</option>
                        {/* Add more categories as needed */}
                    </select>
                </div>

                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                        Stock
                    </label>
                    <input
                        type="number"
                        id="stock"
                        placeholder="Stock"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price
                    </label>
                    <input
                        type="text"
                        id="price"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label htmlFor="productNumber" className="block text-sm font-medium text-gray-700">
                        Product Number
                    </label>
                    <input
                        type="text"
                        id="productNumber"
                        placeholder="Product Number"
                        value={productNumber}
                        onChange={(e) => setProductNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <label htmlFor="active" className="text-sm font-medium text-gray-700">
                        Active
                    </label>
                    <input
                        type="checkbox"
                        id="active"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default AdminProductEditcopy;
