'use client';

// import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/types/cart';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import apiClient from '@/utils/axiosInstance';
import { Product } from '@/types/product';

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const token = useSelector((data: RootState) => data.userState.token);
    const user = useSelector((data: RootState) => data.userState.userEmail);
    const router = useRouter();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await apiClient.get(`/cart/getCartDetails/${user}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setCartItems(response.data.data.items);
                } else {
                    console.error('Failed to fetch cart:', response.data.error);
                }
            } catch (err: any) {
                console.error('Fetch error:', err);
            }
        };

        fetchCart();
    }, []);

    useEffect(()=>{
        const fetchProductDetails = async () => {
            try {
                const productDetailsPromises = cartItems.map(async (item) => {
                    const response = await apiClient.get(`/products/getProductById/${item.productId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.data.success) {
                        return response.data.data;
                    } else {
                        console.error(`Failed to fetch product details for product ID: ${item.productId}`);
                        return null;
                    }
                });
    
                const fetchedProducts = await Promise.all(productDetailsPromises);
                console.log('fetched products', fetchedProducts);
                setProducts(fetchedProducts.filter((product) => product !== null));
            } catch (err: any) {
                console.log('Error fetching product details: ', err);
            }
        };
        if(cartItems.length > 0){
            fetchProductDetails();
        }
    }, [cartItems]);

    const handleSelectItem = (item: CartItem) => {
        if (selectedItems.find((selected) => selected.productId === item.productId)) {
            setSelectedItems(selectedItems.filter((selected) => selected.productId !== item.productId));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const handleRemoveItem = async (item: CartItem) => {
        try {
            const response = await apiClient.post(`/cart/removeFromCart`, {
                user, productId: item.productId, quantity: item.quantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setCartItems(cartItems.filter((cartItem) => cartItem.productId !== item.productId));
            } else {
                console.error('Failed to remove item from cart:', response.data.error);
            }
        } catch (err: any) {
            console.error('Error removing item from cart:', err);
        }
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert('Please select at least one product to place an order.');
            return;
        }
        router.push(`/checkout?items=${encodeURIComponent(JSON.stringify(selectedItems))}`);
    };

    return (
        <div>
            <h1>Cart Items</h1>
            <div>
                {cartItems?.length === 0 ? (
                    <p>Cart is empty!</p>
                ) : (
                    cartItems?.map((item: CartItem, index: number) =>  {
                        const product = products.find((prod) => prod.id === item.productId);
                        const imageUrl = product?.images?.[0]; // Get the first image URL
                        return (
                            <div key={index}>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.some((selected) => selected.productId === item.productId)}
                                    onChange={() => handleSelectItem(item)}
                                />
                                {imageUrl && <img src={imageUrl} alt={item.name} style={{ width: '100px' }} />}
                                <h2>{item.name}</h2>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: {item.price}</p>
                                <p>Net: {item.price*item.quantity}</p>
                                <button onClick={() => handleRemoveItem(item)}>Remove</button>
                            </div>
                        );
                    })
                )}
            </div>
            <button onClick={(e)=>handleCheckout()} disabled={selectedItems.length === 0}>
                Proceed to Checkout
            </button>
        </div>
    );
}
