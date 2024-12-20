import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/redux/store';
import { addToCart } from "../app/redux/features/cartSlice";
// import { addToCartAsync, setUser } from '../redux/features/cartSlice';
import { AppDispatch } from '../app/redux/store';
// import styles from '../styles/Home.module.css';

const Home = () => {
  const [products, setProducts] = useState<any[]>([]); // State to store fetched products
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.cart.user);

  // Fetch products on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/getAllProducts', {
          headers: {
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Products fetched:', response.data);
        if (response.data.success) {
          setProducts(response.data.data); 
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

  const handleAddToCart = (product: { id: string; name: string; price: number }) => {
    const quantity = quantities[product.id] || 1;
    if (user) {
      console.log('Adding to cart:', { user: user.id, productId: product.id, quantity });
      dispatch(addToCart({ user: user.id, productId: product.id, quantity }));
      console.log('Cart after adding item:', cart);
    } else {
      console.error('User not found');
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
