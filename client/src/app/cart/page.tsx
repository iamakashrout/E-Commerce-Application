'use client';

import { useRouter } from 'next/router';
import { CartItem } from '@/types/cart';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import apiClient from '@/utils/axiosInstance';

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
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
    }, [token, user]);

    const handleSelectItem = (item: CartItem) => {
        if (selectedItems.find((selected) => selected.productId === item.productId)) {
            setSelectedItems(selectedItems.filter((selected) => selected.productId !== item.productId));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const handlePlaceOrder = () => {
        if (selectedItems.length === 0) {
            alert('Please select at least one product to place an order.');
            return;
        }

        // Navigate to the order details page with selected items
        router.push({
            pathname: '/order-details',
            query: { items: JSON.stringify(selectedItems) },
        });
    };

    return (
        <div>
            <h1>Cart Items</h1>
            <div>
                {cartItems?.length === 0 ? (
                    <p>Cart is empty!</p>
                ) : (
                    cartItems?.map((item: CartItem, index: number) => (
                        <div key={index}>
                            <input
                                type="checkbox"
                                checked={selectedItems.some((selected) => selected.productId === item.productId)}
                                onChange={() => handleSelectItem(item)}
                            />
                            <h2>{item.productId}</h2>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: {item.price}</p>
                        </div>
                    ))
                )}
            </div>
            <button onClick={handlePlaceOrder} disabled={selectedItems.length === 0}>
                Place Order
            </button>
        </div>
    );
}
