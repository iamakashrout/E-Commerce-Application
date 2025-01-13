'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Order, SelectedProduct } from '@/types/order';
import { useEffect, useState } from 'react';
import apiClient from '@/utils/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";

export default function OrderDetailsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [orderDetails, setOrderDetails] = useState<Order>({} as Order);
    const token = useSelector((data: RootState) => data.userState.token);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await apiClient.get(`/order/getOrderDetails/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                    // console.log('response data data', response.data.data);
                    console.log(response.data);
                    setOrderDetails(response.data.data);
                    console.log("order details: ", orderDetails);
                } else {
                    console.error('Failed to fetch order details:', response.data.error);
                }
            } catch (err: any) {
                console.error('Fetch error:', err);
            }
        };

        if (orderId) fetchOrderDetails();
    }, []);

    function formatMongoDate(mongoDate: Date, options?: Intl.DateTimeFormatOptions): string {
        const date = new Date(mongoDate);
        const defaultOptions: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true, // Use 12-hour format
        };

        // Merge options if provided
        const formatOptions = { ...defaultOptions, ...options };

        return date.toLocaleString(undefined, formatOptions); // Auto-detect locale
    }


    return (
        <div>
            <Navbar />
            <h1 className="text-5xl font-bold mb-8 mt-8 text-center text-black">Order Details</h1>
            {orderDetails ? (
                <div className="bg-custom-light-teal p-8 rounded-lg shadow-md mb-6 w-full max-w-3xl mx-auto mt-24 flex flex-col items-center">
                    <div className="w-full mb-6">
                        <h2 className="font-bold text-lg">Order ID:</h2>
                        <p className="text-base">{orderDetails.orderId}</p>
                    </div>
                    {/* Wrap subtotal and payment mode in a flex container */}
                    <div className="w-full flex justify-between mb-6">
                        {/* subtotal section */}
                        <div className="w-1/2">
                            <h2 className="font-bold text-lg">Subtotal:</h2>
                            <div className="text-lg">
                                {orderDetails?.products?.map((item: SelectedProduct, index: number) => (
                                    <div key={index} className="text-lg">
                                        <p>
                                            {index + 1}. <span className="font-bold">{item.price}</span>
                                        </p>
                                    </div>
                                ))}
                                <p>Tax = 0</p>
                                <p>Shipping = 0</p>
                                <p>Discount = 0</p>
                            </div>
                            <p className="text-2xl font-extrabold text-green-600">
                                Subtotal: {orderDetails?.total?.grandTotal}
                            </p>
                        </div>

                        {/* payment mode section */}
                        <div className="w-1/2">
                            <h2 className="font-bold text-lg">Payment Mode:</h2>
                            <p className="text-lg">{orderDetails.paymentMode}</p>
                        </div>
                    </div>
                    <div className="w-full mb-6">
                        <h2 className="font-bold text-lg">Date:</h2>
                        <p className="text-lg">{formatMongoDate(orderDetails.orderDate)}</p>
                    </div>
                    <div className="w-full mb-6">
                        <h2 className="font-bold text-lg">Address:</h2>
                        <p className="text-lg">{orderDetails.address}</p>
                    </div>
                    <div className="w-full">
                        <h3 className="font-bold text-lg mb-4">Items:</h3>
                        {orderDetails?.products?.map((item: SelectedProduct, index: number) => (
                            
                            <div key={index} className="mb-6 text-lg flex items-start">
                                {/* Display product image if available */}
                                {item.images && item.images.length > 0 && (
                                    <img
                                        src={item.images[0]} // Assuming the first image is to be displayed
                                        alt={item.name}
                                        className="w-16 h-16 object-cover mr-4"
                                    />
                                )}
                                <div>
                                    <p>{item.name}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: {item.price}</p>
                                    <button
                                        onClick={() =>
                                            router.push(
                                                `/review?orderId=${orderId}&productId=${item.productId}&quantity=${item.quantity}`
                                            )
                                        }
                                        className="font-bold text-blue-600 mt-2 text-md"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            ) : (
                <p>Loading order details...</p>
            )}

        </div>
    );

}