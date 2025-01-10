'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {Order, SelectedProduct}  from '@/types/order';
import { useEffect, useState } from 'react';
import apiClient from '@/utils/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import "@/styles/globals.css";

export default function OrderDetailsPage() {
    const router =useRouter();
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
            <h1 className="text-5xl font-bold mb-8 mt-8 text-center text-black">Order Details</h1>
            {orderDetails ? (
                <div className="bg-custom-light-teal p-6 rounded-lg shadow-md mb-6 w-full max-w-md mx-auto mt-24 flex flex-col justify-center items-center">
                    <h2>Order ID: {orderDetails.orderId}</h2>
                    <p>Total: {orderDetails?.total?.grandTotal}</p>
                    <p>Payment Mode: {orderDetails.paymentMode}</p>
                    <p>Date: {formatMongoDate(orderDetails.orderDate)}</p>
                    <p>Address: {orderDetails.address}</p>
                    <h3>Items:</h3>
                    {orderDetails?.products?.map((item: SelectedProduct, index: number) => (
                        <div key={index}>
                            <p>{item.name}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: {item.price}</p>
                            <button
                                onClick={() => router.push(`/review?orderId=${orderId}&productId=${item.productId}&quantity=${item.quantity}`)}
                                style={{ marginBottom: '10px' }}
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading order details...</p>
            )}
        </div>
    );
}