import { useEffect, useState } from "react";
import apiClient from "@/utils/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import ChatBox from "@/components/ChatBox";

interface SalesDataPopupProps {
    productId: string;
    onClose: () => void;
}

export default function SalesData ({ productId, onClose }: SalesDataPopupProps) {
    const token = useSelector((data: RootState) => data.sellerState.token);
    const [salesData, setSalesData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeChat, setActiveChat] = useState<string | null>(null);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await apiClient.get(`/seller/getProductSales/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                    setSalesData(response.data.data);
                } else {
                    alert("Failed to fetch sales data.");
                }
            } catch (error) {
                console.error("Error fetching sales data:", error);
                alert("Error fetching sales data.");
            } finally {
                setLoading(false);
            }
        };

        fetchSalesData();
    }, [productId]);

    const calculateTotalSales = () => {
        const totalUnits = salesData.reduce((sum, sale) => sum + sale.quantity, 0);
        const totalPrice = salesData.reduce((sum, sale) => sum + sale.total, 0);
        return { totalUnits, totalPrice };
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl text-black"> {/* Added text-black here */}
                <h2 className="text-xl font-semibold mb-4">Sales Data</h2>
                {loading ? (
                    <p>Loading sales data...</p>
                ) : (
                    <>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-2">Order ID</th>
                                    <th className="border border-gray-300 p-2">Quantity</th>
                                    <th className="border border-gray-300 p-2">Unit Price</th>
                                    <th className="border border-gray-300 p-2">Total</th>
                                    <th className="border border-gray-300 p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesData.map((sale) => (
                                    <tr key={sale.orderId}>
                                        <td className="border border-gray-300 p-2">{sale.orderId}</td>
                                        <td className="border border-gray-300 p-2">{sale.quantity}</td>
                                        <td className="border border-gray-300 p-2">${sale.unitPrice}</td>
                                        <td className="border border-gray-300 p-2">${sale.total}</td>
                                        <td className="border border-gray-300 p-2">
                                            <button
                                                onClick={() => setActiveChat(sale.orderId)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                            >
                                                Messages
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {salesData.length > 0 && (
                            <div className="mt-4">
                                <p>
                                    <strong>Total Units Sold:</strong> {calculateTotalSales().totalUnits}
                                    <br />
                                    <strong>Total Sales Amount:</strong> ${calculateTotalSales().totalPrice}
                                </p>
                            </div>
                        )}
                    </>
                )}
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                    Close
                </button>

                 {/* Render ChatBox if activeChat is set */}
                 {activeChat && (
                    <ChatBox
                        onClose={() => setActiveChat(null)} // Close chatbox
                    />
                )}
            </div>
        </div>
    );
};
