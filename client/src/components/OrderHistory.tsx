"use client"

import { RootState } from "@/app/redux/store";
import { Order } from "@/types/order";
import apiClient from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
                    const data: Order[] = (response.data.data || []).map((item: Order): Order => {
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
                    }) .sort(
                        (a: Order, b: Order) =>
                            new Date(b.orderDate).getTime() -
                            new Date(a.orderDate).getTime()
                    ); // Sort orders by date (descending);
                    setOrders(data);
                } else {
                    console.error('Failed to fetch orders:', response.data.error);
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error('Error fetching orders:', err.message);
                } else {
                    console.error('An unknown error occurred:', err);
                }
            }
        };

        fetchOrders();
    }, [token, user]);

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
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
            <h2 className="flex items-center">
                <span className="font-bold text-xl">Order History</span>
                <button
                    className="bg-custom-teal dark:bg-custom-light-teal rounded-full px-2 flex items-center justify-center"
                    onClick={toggleExpand}
                    style={{ marginLeft: "10px" }}
                >
                    {isExpanded ? (
                        <ExpandLessIcon style={{ fontSize: "16px" }} />
                    ) : (
                        <ExpandMoreIcon style={{ fontSize: "16px" }} />
                    )}
                </button>
            </h2>
            <br></br>
            {isExpanded && (
                <div>
                    {orders.length > 0 ? (
                        <div>
                            {orders.map((o, index) => (
                                <div key={index} className="border border-black rounded-lg p-4 mb-4 shadow-sm flex justify-between items-center"
                                >
                                   <div>
                                   <p>
                                        <span className="font-bold">Order Number: </span>{o.orderId}
                                    </p>
                                    <p><span className="font-bold">Order Date: </span>{formatMongoDate(o.orderDate)}</p>
                                    <p>
                                        <span className="font-bold">Total: </span>${o.total.grandTotal}
                                        &nbsp;|&nbsp;
                                        <span className="font-bold">Status: </span>{o.status}
                                    </p>
                                    <p><span className="font-bold">Address: </span>{o.address}</p>
                                   </div>
                                    <button className="bg-custom-pink rounded-full px-9 py-1 ml-4 hover:bg-custom-lavender font-bold text-white transition duration-300" onClick={() => handleClick(o.orderId)}>
                                            Details
                                        </button>
                                        <br></br>
                                    <br></br>
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