'use client';

import { RootState } from "@/app/redux/store";
import { Product } from "@/types/product";
import apiClient from "@/utils/axiosInstance";
import flaskClient from "@/utils/flaskInstance";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";
import DummyImage from './DummyImage';

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const token = useSelector((data: RootState) => data.userState.token);
  const user = useSelector((data: RootState) => data.userState.userEmail);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = selectedCategory === 'recommended' ?
        await flaskClient.get(`/get_recommendations/${user}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }) : await apiClient.get('/products/getAllProducts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
    setSelectedCategory(event.target.value);
  };

  const handleImageNavigation = (productId: string, direction: 'prev' | 'next') => {
    setCurrentImageIndex((prev) => {
      const currentIndex = prev[productId] || 0;
      const product = products.find(p => p.id === productId);
      if (!product) return prev;

      const totalImages = product.images.length;
      let newIndex;

      if (direction === 'prev') {
        newIndex = (currentIndex - 1 + totalImages) % totalImages;
      } else {
        newIndex = (currentIndex + 1) % totalImages;
      }

      return { ...prev, [productId]: newIndex };
    });
  };

  if (!user) {
    return <p className="text-center text-red-500 text-lg font-semibold">User authentication failed!</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2 text-center text-black">Products List</h1>
      <div className="mb-4 flex justify-center rounded">
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border rounded text-black font-semibold bg-[#4cd7d0] hover:bg-[#a4e8e0] transition"
        >
          <option value="all">All Products</option>
          <option value="recommended">Recommended Products</option>
        </select>
      </div>
      <div className="mb-6"><SearchBar userId={user} onSearch={handleSearch} products={products} /></div>
      {loading ? (
        <p className="text-center font-bold text-[#4cd7d0] text-4xl">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No products found!</p>
          ) : (
            filteredProducts.map((product: Product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 shadow-md transition-transform transform bg-[#a4e8e0] hover:shadow-lg hover:scale-105 hover:-translate-y-2"
              >
                <div className="flex flex-col items-center">
                  {product.images.length > 0 ? (
                    <div className="relative w-full mb-4">
                      <div className="flex items-center justify-center">
                        {product.images.length > 1 && (
                          <button
                            onClick={() => handleImageNavigation(product.id, 'prev')}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#40bfb8] bg-opacity-50 text-white p-1 rounded-full mr-2"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                        )}
                        <img
                          src={product.images[currentImageIndex[product.id] || 0]}
                          alt={`${product.name}`}
                          className="w-48 h-48 object-cover rounded-lg"
                        />
                        {product.images.length > 1 && (
                          <button
                            onClick={() => handleImageNavigation(product.id, 'next')}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#40bfb8] bg-opacity-50 text-white p-1 rounded-full ml-2"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
          <DummyImage />
          {/* <p className="text-gray-500 italic mt-2"></p> */}
        </div>
                  )}
                  <h2 className="text-xl font-bold mb-2 text-custom-purple">{product.name}</h2>
                  <p className="text-gray-600 font-semibold mb-1">{product.company}, Category: {product.category}</p>
                  <p className="text-green-600 font-bold mb-1">Price: ${product.price}, Stock: {product.stock}</p>
                  <div className="flex items-center space-x-3">
                    <label htmlFor={`quantity-${product.id}`} className="text-gray-700 font-semibold">
                      Quantity:
                    </label>
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
                      className="px-2 py-2 bg-custom-pink hover:bg-custom-lavender text-white rounded transition font-bold"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

