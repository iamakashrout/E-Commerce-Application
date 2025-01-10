'use client';

import { CartItem } from '@/types/cart';
import { Address } from '@/types/address';
import { Total } from '@/types/order';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import apiClient from '@/utils/axiosInstance';
import { loadStripe } from '@stripe/stripe-js';
import { setOrder } from '../redux/features/orderSlice';
import "@/styles/globals.css";

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const items = searchParams.get('items');
    const selectedItems = items ? JSON.parse(items) : [];
    const dispatch = useDispatch();
    const token = useSelector((data: RootState) => data.userState.token);
    const user = useSelector((data: RootState) => data.userState.userEmail);

    const [paymentMode, setPaymentMode] = useState('COD');
    const [address, setAddress] = useState('');
    const [newAddressName, setNewAddressName] = useState('');
    const [newAddressValue, setNewAddressValue] = useState('');
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
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
                    // console.log(response.data.data.addresses);
                } else {
                    console.error('Failed to fetch addresses:', response.data.error);
                }
            } catch (err: any) {
                console.error('Error fetching addresses:', err);
            }
        };

        fetchAddresses();
    }, []);

    const handleAddAddress = async () => {
        if (!newAddressName || !newAddressValue) {
            alert('Please provide both name and address.');
            return;
        }

        try {
            const response = await apiClient.post(
                '/address/addAddress',
                {
                    user,
                    name: newAddressName,
                    address: newAddressValue,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                alert('Address added successfully!');
                setSavedAddresses(response.data.data.addresses || []);
                setNewAddressName('');
                setNewAddressValue('');
            } else {
                alert(response.data.error || 'Failed to add address.');
            }
        } catch (error) {
            console.error('Error adding address:', error);
            alert('An error occurred while adding the address.');
        }
    };

    const handleConfirmOrder = async () => {
        if (!user) {
            alert('User could not be validated.');
            return;
        }
        if (!address) {
            alert('Please select or provide a valid address.');
            return;
        }

        const subtotal = selectedItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
        const tax = 0;
        const shipping = 0;
        const discount = 0;
        const grandTotal = subtotal + tax + shipping + discount;
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
            } as Total,
        };
        console.log('order payload', orderPayload);

        try {

            dispatch(setOrder(orderPayload));
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

            const stripeResponse = await apiClient.post(`/order/paymentGateway`,
                orderPayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const session = stripeResponse.data;

            const result = stripe?.redirectToCheckout({
                sessionId: session.id
            });

            if ((await result)?.error) {
                console.error('Error during checkout redirect:', (await result)?.error.message);
                alert(`Error: ${(await result)?.error.message}`);
            }
            else {
                console.log('Payment gateway called:', result);
                alert('Redirecting to payment gateway...');
            }

            // router.push(`/paymentStatus?status=True`);
        } catch (err: any) {
            console.error('Order error:', err);
            alert('An error occurred while placing the order.');
        }
    };

    return (
        <div className="container mx-auto p-6 bg-[#fbf5c4] min-h-screen">
            {/* Order Summary Header */}
            <h1 className="text-5xl font-bold mb-8 text-center text-black">Order Summary</h1>
    
            {/* Selected Items Section */}
            <div className="bg-custom-light-teal p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-black">Selected Items</h2>
                {selectedItems.map((item: CartItem, index: number) => (
                    <div
                        key={index}
                        className="border-b border-gray-300 py-4 flex justify-between items-center"
                    >
                        <div>
                            <h3 className="text-lg font-medium">{item.name}</h3>
                            <p className="text-md text-gray-600">Quantity: {item.quantity}</p>
                            <p className="text-md text-gray-600">Price: ₹{item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
    
            {/* Payment Mode Section */}
            <div className="bg-custom-light-teal p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-black">Payment Mode</h2>
                <label className="block text-gray-700 font-medium">
                    <span className="block mb-2">Choose Payment Mode:</span>
                    <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-700 bg-white"
                    >
                        <option value="COD">Cash on Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </label>
            </div>
    
            {/* Address Selection Section */}
            <div className="bg-custom-light-teal p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-black">Select Address</h2>
                {savedAddresses.length > 0 ? (
                    <div>
                        {savedAddresses.map((savedAddress, index) => (
                            <div
                                key={index}
                                className="flex items-center mb-4 gap-2"
                            >
                                <input
                                    type="radio"
                                    id={`address-${index}`}
                                    name="address"
                                    value={savedAddress.address}
                                    onChange={() => {
                                        setAddress(savedAddress.address);
                                        setIsManualAddress(false);
                                    }}
                                    className="w-4 h-4"
                                />
                                <label
                                    htmlFor={`address-${index}`}
                                    className="text-gray-700"
                                >
                                    {savedAddress.name}
                                </label>
                            </div>
                        ))}
                        <div className="flex items-center mb-4 gap-2">
                            <input
                                type="radio"
                                id="manual-address"
                                name="address"
                                checked={isManualAddress}
                                onChange={() => {
                                    setAddress('');
                                    setIsManualAddress(true);
                                }}
                                className="w-4 h-4"
                            />
                            <label
                                htmlFor="manual-address"
                                className="text-gray-700"
                            >
                                Enter a new address
                            </label>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600 text-md">No saved addresses found. Please enter a new address.</p>
                )}
                {/* Add New Address Section */}
                <div className="mt-4">
                    <h3 className="text-xl font-medium mb-2">Add a New Address</h3>
                    <input
                        type="text"
                        placeholder="Address Name"
                        value={newAddressName}
                        onChange={(e) => setNewAddressName(e.target.value)}
                        className="w-full p-2 mb-2 border border-gray-300 rounded-md text-gray-700"
                    />
                    <textarea
                        placeholder="Address Details"
                        value={newAddressValue}
                        onChange={(e) => setNewAddressValue(e.target.value)}
                        className="w-full p-2 mb-2 border border-gray-300 rounded-md text-gray-700"
                    />
                    <button
                        onClick={handleAddAddress}
                        className="bg-[#4cd7d0] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-[#a4e8e0] transition"
                    >
                        Add Address
                    </button>
                </div>
            </div>
    
            {/* Confirm Order Button */}
            <div className="text-center">
                <button
                    onClick={handleConfirmOrder}
                    className="bg-[#4cd7d0] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-[#a4e8e0] transition"
                >
                    Confirm Order
                </button>
            </div>
        </div>
    );
    
}