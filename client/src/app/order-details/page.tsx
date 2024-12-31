'use client';

import { CartItem } from '@/types/cart';
import { IAddress } from '@/types/address';
import { ITotal } from '@/types/order';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import apiClient from '@/utils/axiosInstance';

export default function OrderDetailsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const items = searchParams.get('items');
    const selectedItems = items ? JSON.parse(items) : [];
    const token = useSelector((data: RootState) => data.userState.token);
    const user = useSelector((data: RootState) => data.userState.userEmail);

    const [paymentMode, setPaymentMode] = useState('COD');
    const [address, setAddress] = useState('');
    const [savedAddresses, setSavedAddresses] = useState<IAddress[]>([]);
    const [isManualAddress, setIsManualAddress] = useState(false);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await apiClient.get(`/address/getAddresses/${user}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setSavedAddresses(response.data.data.addresses || []);
                    // console.log('Addresses:', savedAddresses);
                    console.log(response.data.data.addresses);
                } else {
                    console.error('Failed to fetch addresses:', response.data.error);
                }
            } catch (err: any) {
                console.error('Error fetching addresses:', err);
            }
        };

        fetchAddresses();
    }, [token, user]);

    const handleConfirmOrder = async () => {
        if (!address) {
            alert('Please select or provide a valid address.');
            return;
        }

        const subtotal = selectedItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
        const tax = 0;
        const shipping = 0;
        const discount = 0;
        const grandTotal = subtotal;
        const orderPayload = {
            user,
            products: selectedItems.map((item: CartItem) => ({
                productId: item.productId,
                quantity: item.quantity,
                name: item.name,
                price: item.price,
            })),
            paymentMode,
            address,
            total: {
                subtotal,
                tax,
                shipping,
                discount,
                grandTotal,
            } as ITotal,
        };
        console.log(orderPayload);
        try {
            const response = await apiClient.post(`/order/placeOrder`, orderPayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                // console.log('Order placed:', response.data.orderId);
                // console.log('Order placed:', response.data.data.orderId);
                // alert(`Order placed: ${response.data.orderId}`);
                router.push(`/order-summary?orderId=${response.data.data.orderId}`);
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
            <h1>Order Details</h1>
            <div>
                <h2>Selected Items</h2>
                {selectedItems.map((item: CartItem, index: number) => (
                    <div key={index}>
                        <h3>{item.name}</h3>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: {item.price}</p>
                    </div>
                ))}
            </div>
            <div>
                <label>
                    Payment Mode:
                    <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                        <option value="COD">Cash on Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </label>
            </div>
            <div>
                <h2>Select Address</h2>
                {savedAddresses.length > 0 ? (
                    <div>
                        {savedAddresses.map((savedAddress, index) => (
                            <div key={index}>
                                <input
                                    type="radio"
                                    id={`address-${index}`}
                                    name="address"
                                    value={JSON.stringify(savedAddress)}
                                    onChange={() => {
                                        setAddress(JSON.stringify(savedAddress));
                                        setIsManualAddress(false);
                                    }}
                                />
                                <label htmlFor={`address-${index}`}>{savedAddress.name}</label>
                            </div>
                        ))}
                        <div>
                            <input
                                type="radio"
                                id="manual-address"
                                name="address"
                                checked={isManualAddress}
                                onChange={() => {
                                    setAddress('');
                                    setIsManualAddress(true);
                                }}
                            />
                            <label htmlFor="manual-address">Enter a new address</label>
                        </div>
                    </div>
                ) : (
                    <p>No saved addresses found. Please enter a new address.</p>
                )}
                {isManualAddress && (
                    <textarea
                        placeholder="Enter your address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                )}
            </div>
            <button onClick={handleConfirmOrder}>Confirm Order</button>
        </div>
    );
}
