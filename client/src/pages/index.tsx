import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import styles from '../styles/Home.module.css';

const Home = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState<any[]>([]); // State to store fetched products
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // Fetch products on page load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/getAllProducts', {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        });
        if (response.data.success) {
          setProducts(response.data.data); // Update state with fetched products
        } else {
          console.error('Failed to fetch products:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [productId]: quantity }));
  };

  const handleAddToCart = async (product: { id: string; name: string; price: number }) => {
    const quantity = quantities[product.id] || 1;
    try {
      console.log('Adding item to cart:', product, quantity, product.id);
      const response = await axios.post('http://localhost:5000/api/cart/addToCart', {
        productId: product.id,
        quantity,
      });

      if (response.data.success) {
        dispatch(addToCart({ ...product, quantity }));
        console.log('Item added to cart:', response.data.data);
      } else {
        console.error('Failed to add item to cart:', response.data.error);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  return (
    <div>
      <h1>Products</h1>
      <div>
        {products.length === 0 ? (
          <p>Loading products...</p> // Display loading message if products are still being fetched
        ) : (
          products.map((product: { id: string; name: string; price: number }) => (
            <div key={product.id}>
              <h2>{product.name}</h2>
              <p>${product.price}</p>

              {/* Quantity Selector */}
              <label htmlFor={`quantity-${product.id}`}>Quantity:</label>
              <select
                id={`quantity-${product.id}`}
                value={quantities[product.id] || 1}
                onChange={e => handleQuantityChange(product.id, parseInt(e.target.value, 10))}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              {/* Add to Cart Button */}
              <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
