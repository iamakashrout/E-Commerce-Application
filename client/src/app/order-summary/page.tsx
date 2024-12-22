'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {IOrder, ISelectedProduct}  from '@/types/order';
import { useEffect, useState } from 'react';
import apiClient from '@/utils/axiosInstance';

export default function OrderSummaryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [orderDetails, setOrderDetails] = useState<IOrder>({} as IOrder);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await apiClient.get(`/order/getOrderDetails/${orderId}`);
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

    return (
        <div>
            <h1>Order Summary</h1>
            {orderDetails ? (
                <div>
                    <h2>Order ID: {orderDetails?.orderId}</h2>
                    <p>Total: {orderDetails?.total?.grandTotal}</p>
                    <p>Payment Mode: {orderDetails.paymentMode}</p>
                    <p>Address: {orderDetails.address}</p>
                    <h3>Items:</h3>
                    {orderDetails?.products?.map((item: ISelectedProduct, index: number) => (
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
