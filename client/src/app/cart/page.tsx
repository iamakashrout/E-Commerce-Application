'use client';

import { CartItem } from '@/types/cart';
import { IOrder, ISelectedProduct } from "@/types/order";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import apiClient from '@/utils/axiosInstance';

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
    const token = useSelector((data: RootState) => data.userState.token);
    const user = useSelector((data: RootState) => data.userState.userEmail);

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

    const handleDeleteFromCart = async (item: CartItem) => {
        try {
            const response = await apiClient.post(
                `/cart/removeFromCart`,
                {
                    user,
                    productId: item.productId,
                    quantity: item.quantity,
                    name: item.name,
                    price: item.price,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                alert('Product removed from cart successfully!');
                setCartItems((prevItems) => prevItems.filter((cartItem) => cartItem.productId !== item.productId));
            } else {
                console.error('Failed to delete item from cart:', response.data.error);
                alert('Failed to remove product from cart.');
            }
        } catch (err: any) {
            console.error('Delete error:', err);
            alert('An error occurred while removing the product from the cart.');
        }
    };

    const handleSelectItem = (item: CartItem) => {
        if (selectedItems.find((selected) => selected.productId === item.productId)) {
            setSelectedItems(selectedItems.filter((selected) => selected.productId !== item.productId));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const calculateTotal = (items: CartItem[]) => {
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * 0.1; // Example tax rate: 10%
        const shipping = items.length > 0 ? 50 : 0; // Flat shipping fee
        const discount = 0; // Add discount logic if needed
        const grandTotal = subtotal + tax + shipping - discount;

        return { subtotal, tax, shipping, discount, grandTotal };
    };

    const handlePlaceOrder = async () => {
        if (selectedItems.length === 0) {
            alert('Please select at least one product to place an order.');
            return;
        }

        const totals = calculateTotal(selectedItems);

        const orderPayload = {
            user,
            products: selectedItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                name: item.name,
                price: item.price,
            })),
            paymentMode: 'COD', // Replace with a user-selected payment mode if needed
            address: 'User Address', // Replace with a user-selected address if needed
            total: totals,
        };

        try {
            const response = await apiClient.post(`/order/placeOrder`, orderPayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                alert('Order placed successfully!');
                // Clear selected items and optionally refresh cart
                setSelectedItems([]);
                setCartItems(cartItems.filter((item) => !selectedItems.some((selected) => selected.productId === item.productId)));
            } else {
                console.error('Failed to place order:', response.data.error);
                alert('Failed to place order. Please try again.');
            }
        } catch (err: any) {
            console.error('Order error:', err);
            alert('An error occurred while placing the order.');
        }
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
                            <button onClick={() => handleDeleteFromCart(item)}>Remove</button>
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
