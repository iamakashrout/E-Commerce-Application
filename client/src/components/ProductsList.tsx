'use client';

import { RootState } from "@/app/redux/store";
import { Product } from "@/types/product";
import apiClient from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const token = useSelector((data: RootState) => data.userState.token);
  const user = useSelector((data: RootState) => data.userState.userEmail);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/products/getAllProducts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Products: ', response.data);
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        console.error('Failed to fetch products:', response.data.error);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
    }
  };

  // Fetch recommendations from Flask API
  const fetchRecommendations = async () => {
    try {
      const response = await apiClient.get('http://localhost:5000/recommendations', {
        params: {
          item_name: "sample_item_name", // Replace with a dynamic item name if needed
          top_n: 4,
        },
      });
      console.log('Recommendations: ', response.data);
      if (response.data.success) {
        setRecommendations(response.data.recommendations);
      } else {
        console.error('Failed to fetch recommendations:', response.data.message);
      }
    } catch (err: any) {
      console.error("Recommendations fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    // fetchRecommendations(); // Fetch recommendations when the component mounts
  }, []);

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

  return (
    <div>
      <h1>Products List</h1>
      <div>
        {products.length === 0 ? (
          <p>Loading products...</p>
        ) : (
          products.map((product: Product, index: number) => (
            <div key={index}>
              <h2>{product.name}</h2>
              <p>${product.price}</p>
              <p>Stock: {product.stock}</p>
              <div>
                <label htmlFor={`quantity-${product.id}`}>Quantity: </label>
                <input
                  id={`quantity-${product.id}`}
                  type="number"
                  min="0"
                  max={product.stock}
                  value={quantities[product.id] || 0}
                  onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
                  style={{ color: 'black' }}
                />
                <button onClick={() => handleAddToCart(product.id, product.name, product.price)}>Add to Cart</button>
              </div>
            </div>
          ))
        )}
      </div>

      <h1>Recommendations</h1>
      <div>
        {recommendations.length === 0 ? (
          <p>Loading recommendations...</p>
        ) : (
          recommendations.map((rec: Product, index: number) => (
            <div key={index}>
              <h2>{rec.name}</h2>
              <p>${rec.price}</p>
              <p>Stock: {rec.stock}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
