import { RootState } from "@/app/redux/store";
import apiClient from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface ReviewDataPopupProps {
    productId: string;
    onClose: () => void;
}

export default function ReviewData({ productId, onClose }: ReviewDataPopupProps) {
    const token = useSelector((data: RootState) => data.sellerState.token);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await apiClient.get(`/review/getProductReviews/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                    setReviews(response.data.data);
                } else {
                    alert("Failed to fetch reviews.");
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
                alert("Error fetching reviews.");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-4/5 max-w-4xl">
                <h2 className="text-xl font-semibold mb-4 text-black">Reviews</h2>
                {loading ? (
                    <p>Loading reviews...</p>
                ) : (
                    <table className="w-full table-auto border-collapse text-black">
                        <thead>
                            <tr>
                                <th className="border-b p-2 text-left">User</th>
                                <th className="border-b p-2 text-left">Quantity</th>
                                <th className="border-b p-2 text-left">Rating</th>
                                <th className="border-b p-2 text-left">Review</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.length > 0 ? (
                                reviews.map((review, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-2">{review.user}</td>
                                        <td className="p-2">{review.quantity}</td>
                                        <td className="p-2">{review.rating}</td>
                                        <td className="p-2">{review.reviewText}</td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-2 text-black-500">
                                        No reviews available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
                <div className="mt-4 text-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
