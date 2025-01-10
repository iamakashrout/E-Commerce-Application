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
    const sellerName = useSelector((data: RootState) => data.sellerState.sellerName);
    const [salesData, setSalesData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatRoomId, setChatRoomId] = useState<string | null>(null);
    const [receiver, setReceiver] = useState<string | null>(null);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await apiClient.get(`/seller/getProductSales/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                    console.log(response.data.data);
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

    const handleOpenChat = async (buyer: string) => {
        try {
            // Fetch or create chat room ID
            const response = await apiClient.post('/chat/getOrCreateChatRoom', { buyerId: buyer, sellerId: sellerName });
            if (response.data.success) {
                setChatRoomId(response.data.chatRoomId);
                setReceiver(buyer);
                setIsChatOpen(true);
            } else {
                alert('Failed to initialize chat room');
            }
        } catch (err) {
            console.error('Error initializing chat room:', err);
        }
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
    };
    
    if(!sellerName){
        return <p>Seller authentication failed!</p>
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-custom-light-teal p-6 rounded-lg shadow-lg w-full max-w-2xl text-black"> {/* Added text-black here */}
                <h2 className="text-xl font-semibold mb-4">Sales Data</h2>
                {loading ? (
                    <p>Loading sales data...</p>
                ) : (
                    <>
                        <table className="w-full border-collapse border border-black">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-black p-2">Order ID</th>
                                    <th className="border border-black p-2">Quantity</th>
                                    <th className="border border-black p-2">Unit Price</th>
                                    <th className="border border-black p-2">Total</th>
                                    <th className="border border-black p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesData.map((sale) => (
                                    <tr key={sale.orderId}>
                                        <td className="border border-black p-2">{sale.orderId}</td>
                                        <td className="border border-black p-2">{sale.quantity}</td>
                                        <td className="border border-black p-2">${sale.unitPrice}</td>
                                        <td className="border border-black p-2">${sale.total}</td>
                                        <td className="border border-black p-2">
                                            <button
                                                onClick={()=>handleOpenChat(sale.buyer)}
                                                className="px-3 py-1 bg-custom-pink text-white rounded-md hover:bg-custom-lavender transition"
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
                    className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                >
                    Close
                </button>

                 {/* Render ChatBox if activeChat is set */}
                 {isChatOpen && chatRoomId && receiver &&  (
                    <ChatBox
                    chatRoomId={chatRoomId}
                    userId={sellerName}
                    receiverId={receiver} onClose={handleCloseChat}
                    />
                )}
            </div>
        </div>
    );
};
