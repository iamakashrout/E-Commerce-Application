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
import Navbar from "@/components/Navbar";
import { Product } from '@/types/product';

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
    const [products, setProducts] = useState<Product[]>([]);

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

    useEffect(()=>{
        const fetchProductDetails = async () => {
            try {
                const productDetailsPromises = selectedItems.map(async (item: any) => {
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
        if(selectedItems.length > 0){
            fetchProductDetails();
        }
    }, [selectedItems]);

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
        <main className='dark:bg-black min-h-screen overflow-hidden'>
            <Navbar/>
        <div className="container mx-auto p-6">
            {/* Order Summary Header */}
            <h1 className="text-3xl font-bold mb-8 text-center text-black dark:text-custom-teal">Order Summary</h1>
    
            {/* Selected Items Section */}
            <div className="bg-custom-light-teal dark:bg-custom-teal p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-bold mb-4 text-black">Selected Items</h2>
                {selectedItems.map((item: CartItem, index: number) => {
                    const product = products.find((prod) => prod.id === item.productId);
                    const imageUrl = product?.images?.[0]; // Get the first image URL
                    return (
                        <div
                            key={index}
                            className="border-b border-gray-300 py-2 flex justify-between items-center"
                        >
                            <div>
                                <h3 className="text-lg font-semibold">{item.name}</h3>
                                <p className="text-md text-gray-600">Quantity: {item.quantity}</p>
                                <p className="text-md text-gray-600">Price: ${item.price}</p>
                                <p className="text-md text-gray-800 font-semibold">Net: ${item.price*item.quantity}</p>
                            </div>
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt={item.name}
                                    className="w-36 h-36 object-cover rounded-lg"
                                />
                            )}
                        </div>
                    );
                })}
                <div className="flex mt-4 text-xl font-bold">
            <p>
                Total: $
                {selectedItems
                    .reduce((total: number, item: any) => total + item.price * item.quantity, 0)
                    .toFixed(2)}
            </p>
        </div>
            </div>
    
            {/* Payment Mode Section */}
            <div className="bg-custom-light-teal dark:bg-custom-teal p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-bold mb-4 text-black">Payment Mode</h2>
                <label className="block text-gray-700 font-semibold">
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
            <div className="bg-custom-light-teal dark:bg-custom-teal p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-bold mb-4 text-black">Select Address</h2>
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
                                    className="text-gray-700 font-semibold"
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
                                className="text-gray-700 font-semibold"
                            >
                                Enter a new address
                            </label>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600 text-md">No saved addresses found. Please enter a new address.</p>
                )}
                {/* Add New Address Section */}
                {isManualAddress && <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-2">Add a New Address</h3>
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
                        className="bg-custom-pink text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-custom-lavender transition"
                    >
                        Add Address
                    </button>
                </div>}
            </div>
    
            {/* Confirm Order Button */}
            <div className="text-center">
                <button
                    onClick={handleConfirmOrder}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-green-600 transition"
                >
                    Confirm Order
                </button>
            </div>
        </div>
        </main>
    );
    
}