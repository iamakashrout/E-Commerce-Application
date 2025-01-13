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
            <h1 className="text-3xl font-bold mb-8 mt-8 text-center text-black">Order Details</h1>
            {orderDetails ? (
                <div className="bg-custom-light-teal p-8 rounded-lg shadow-md mb-6 w-full max-w-3xl mx-auto mt-8 flex flex-col items-center">
                    <div className="w-full mb-6">
                        <h2 className="font-bold text-lg">Order ID:</h2>
                        <p className="text-base">{orderDetails.orderId}</p>
                    </div>
                     {/* Wrap subtotal and payment mode in a flex container */}
                     <div className="w-full flex justify-between mb-6">
                        {/* subtotal section */}
                        <div className="w-1/2">
                            <h2 className="font-bold text-lg">Details:</h2>
                            <div className="text-lg">
                                {/* {orderDetails?.products?.map((item: SelectedProduct, index: number) => (
                                    <div key={index} className="text-lg">
                                        <p>
                                            {index + 1}. <span className="font-bold">{item.price} x {item.quantity} = {item.price*item.quantity}</span>
                                        </p>
                                    </div>
                                ))} */}
                                <p>Subtotal: ${orderDetails.total.subtotal}</p>
                                <p>Tax: ${orderDetails.total.tax}</p>
                                <p>Shipping: ${orderDetails.total.shipping}</p>
                                <p>Discount: ${orderDetails.total.discount}</p>
                            </div>
                        </div>

                        {/* payment mode section */}
                        <div className="w-1/2">
                            <h2 className="font-bold text-lg">Payment Mode:</h2>
                            <p className="text-lg">{orderDetails.paymentMode}</p>
                            <p className="text-2xl font-extrabold text-green-600">
                                Grand Total: ${orderDetails?.total?.grandTotal}
                            </p>
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
                        {orderDetails?.products?.map((item: SelectedProduct, index: number) => {
                            const product = products.find((prod) => prod.id === item.productId);
                            const imageUrl = product?.images?.[0];
                            return (
                                <div key={index} className="mb-6 text-lg flex items-start border border-black rounded-lg p-4">
                                    <div className="flex-grow">
                                        <p className="font-semibold">{item.name}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: ${item.price}</p>
                                        <p>Net: ${item.price*item.quantity}</p>
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/review?orderId=${orderId}&productId=${item.productId}&quantity=${item.quantity}`
                                                )
                                            }
                                            className="font-bold bg-custom-pink text-white mt-2 text-md hover:bg-custom-lavender rounded-full px-4 transition duration-300"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                    <div className="ml-4 mr-6 mb-4 mt-2 w-32 h-32 relative flex-shrink-0">
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