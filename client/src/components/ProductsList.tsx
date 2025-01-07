'use client';

import { RootState } from "@/app/redux/store";
import { Product } from "@/types/product";
import apiClient from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";  
import flaskClient from "@/utils/flaskInstance";

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const token = useSelector((data: RootState) => data.userState.token);
  const user = useSelector((data: RootState) => data.userState.userEmail);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = selectedCategory === 'recommended' ? 
      await flaskClient.get(`/get_recommendations/${user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }): await apiClient.get('/products/getAllProducts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Products: ', response.data);
      if (response.data.success) {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
        setLoading(false);
      } else {
        console.error('Failed to fetch products:', response.data.error);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleQuantityChange = (productId: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleAddToCart = async (productId: string, name: string, price: number) => {
    const quantity = quantities[productId] || 0;
    if (quantity === 0) {
      alert('Please select a quantity greater than 0.');
      return;
    }

    try {
      const response = await apiClient.post(
        '/cart/addToCart',
        {
          user,
          productId,
          quantity,
          name,
          price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        alert('Product added to cart successfully!');
      } else {
        console.error('Failed to add to cart:', response.data.error);
        alert('Failed to add product to cart.');
      }
    } catch (err: any) {
      console.error("Add to cart error:", err);
      alert('An error occurred while adding the product to the cart.');
    }
  };

  const handleSearch = (query: string) => {
    const keywords = query.toLowerCase().split(' ');
    const filtered = products.filter((product) =>
      keywords.every((keyword) =>
        product.name.toLowerCase().includes(keyword) ||
        product.company.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword)
      )
    );
    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    setSelectedCategory(event.target.value); // Change selected category
  };

  if(!user){
    return <p className="text-center text-red-500 text-lg font-semibold">User authentication failed!</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white-800">Products List</h1>
      {/* Dropdown for selecting product category */}
      <div className="mb-4">
        {/* <label htmlFor="category" className="text-white-800 mr-2">Select Category:</label> */}
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border rounded text-black"
        >
          <option value="all">All Products</option>
          <option value="recommended">Recommended Products</option>
        </select>
      </div>
      <SearchBar userId={user} onSearch={handleSearch} products={products} />
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No products found!</p>
        ) : (
          filteredProducts.map((product: Product, index: number) => (
            <div key={index} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-1">{product.company}</p>
              <p className="text-green-600 font-bold mb-1">${product.price}</p>
              <p className="text-gray-500 mb-1">Category: {product.category}</p>
              <p className="text-gray-500 mb-4">Stock: {product.stock}</p>
              <div className="flex items-center space-x-3">
                <label htmlFor={`quantity-${product.id}`} className="text-gray-700">Quantity:</label>
                <input
                  id={`quantity-${product.id}`}
                  type="number"
                  min="0"
                  max={product.stock}
                  value={quantities[product.id] || 0}
                  onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
                  className="w-16 p-1 border rounded text-gray-700"
                />
                <button
                  onClick={() => handleAddToCart(product.id, product.name, product.price)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      )}
    </div>
  );
}