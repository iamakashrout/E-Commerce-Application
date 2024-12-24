"use client"

import { RootState } from "@/app/redux/store";
import { Order } from "@/types/order";
import apiClient from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function OrderHistory() {

    const user = useSelector((data: RootState) => data.userState.userEmail);
    const token = useSelector((data: RootState) => data.userState.token);

    const [orders, setOrders] = useState<Order[]>([]);

    const router = useRouter();

    const handleClick = (orderId: string) => {
        router.push(`/orderDetails?orderId=${orderId}`);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await apiClient.get(`/order/getAllOrders/${user}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    const data: Order[] = (response.data.data || []).map((item: any): Order => {
                        return {
                            orderId: item.orderId,
                            user: item.user,
                            products: item.products,
                            orderDate: item.orderDate,
                            status: item.status,
                            paymentMode: item.paymentMode,
                            address: item.address,
                            total: item.total
                        };
                    });
                    setOrders(data);
                } else {
                    console.error('Failed to fetch orders:', response.data.error);
                }
            } catch (err: any) {
                console.error('Error fetching orders:', err);
            }
        };

        fetchOrders();
    }, []);

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div>
            <h2>
                Order History
                <button onClick={toggleExpand} style={{ marginLeft: "10px" }}>
                    {isExpanded ? "Hide" : "Show"}
                </button>
            </h2>
            {isExpanded && (
                <div>
                    {orders.length > 0 ? (
                        <div>
                                {orders.map((o, index) => (
                                    <div key={index}>
                                        <h3>
                                            {index + 1} {o.orderId}
                                            <button onClick={()=>handleClick(o.orderId)} style={{ marginLeft: "10px" }}>
                                                Details
                                            </button>
                                        </h3>
                                        <p>{o.orderDate.toString()}</p>
                                        <p>{o.total.grandTotal}</p>
                                        <p>{o.status}</p>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <p>No past orders</p>
                    )}
                </div>
            )}
        </div>
    )
}