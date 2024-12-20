'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import apiClient from '@/utils/axiosInstance';

export default function OrderSummaryPage() {
    const router = useRouter();
    const { orderId } = router.query;
    const [orderDetails, setOrderDetails] = useState<any>(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await apiClient.get(`/order/getOrderDetails/${orderId}`);
                if (response.data.success) {
                    setOrderDetails(response.data.data);
                } else {
                    console.error('Failed to fetch order details:', response.data.error);
                }
            } catch (err: any) {
                console.error('Fetch error:', err);
            }
        };

        if (orderId) fetchOrderDetails();
    }, [orderId]);

    return (
        <div>
            <h1>Order Summary</h1>
            {orderDetails ? (
                <div>
                    <h2>Order ID: {orderDetails.id}</h2>
                    <p>Total: {orderDetails.total}</p>
                    <p>Payment Mode: {orderDetails.paymentMode}</p>
                    <p>Address: {orderDetails.address}</p>
                    <h3>Items:</h3>
                    {orderDetails.products.map((item: any, index: number) => (
                        <div key={index}>
                            <p>{item.name}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: {item.price}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading order details...</p>
            )}
        </div>
    );
}
