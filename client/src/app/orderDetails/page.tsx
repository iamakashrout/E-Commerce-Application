'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {Order, SelectedProduct}  from '@/types/order';
import { useEffect, useState } from 'react';
import apiClient from '@/utils/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function OrderDetailsPage() {
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

    return (
        <div>
            <h1>Order Details</h1>
            {orderDetails ? (
                <div>
                    <h2>Order ID: {orderDetails.orderId}</h2>
                    <p>Total: {orderDetails?.total?.grandTotal}</p>
                    <p>Payment Mode: {orderDetails.paymentMode}</p>
                    <p>Address: {orderDetails.address}</p>
                    <h3>Items:</h3>
                    {orderDetails?.products?.map((item: SelectedProduct, index: number) => (
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
