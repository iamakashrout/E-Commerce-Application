'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Order, SelectedProduct } from '@/types/order';
import { Product } from '@/types/product';
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
    const [products, setProducts] = useState<Product[]>([]);
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

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                if (orderDetails?.products?.length > 0) {
                    const productDetailsPromises = orderDetails.products.map(async (item) => {
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
                }
            } catch (err: any) {
                console.log('Error fetching product details: ', err);
            }
        };

        if (orderId) {
            fetchProductDetails();
        }
    }, [orderDetails, token, orderId]);


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
                    {/* ... (existing code for Order ID, Subtotal, Payment Mode, Date, and Address remains the same) */}

                    <div className="w-full">
                        <h3 className="font-bold text-lg mb-4">Items:</h3>
                        {orderDetails?.products?.map((item: SelectedProduct, index: number) => {
                            const product = products.find((prod) => prod.id === item.productId);
                            const imageUrl = product?.images?.[0];
                            return (
                                <div key={index} className="mb-6 text-lg flex items-start">
                                    <div className="flex-grow">
                                        <p className="font-semibold">{item.name}</p>
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
                                    <div className="ml-4 mr-6 mb-4 w-32 h-32 relative flex-shrink-0">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={item.name}
                                                className="rounded-md w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
                                                <span className="text-gray-500 text-xs">No image</span>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <p>Loading order details...</p>
            )}
        </div>
    );


}