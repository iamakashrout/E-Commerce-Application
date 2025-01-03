'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import apiClient from '@/utils/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { Product } from '@/types/product';
import ChatBox from '@/components/ChatBox';

// interface Product {
//     productId: string;
//     name: string;
//     description: string;
//     price: number;
//     quantity: number;
//     imageUrl?: string;
// }

export default function AddReviewPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const productId = searchParams.get('productId');
    const quantity = searchParams.get('quantity');
    const token = useSelector((data: RootState) => data.userState.token);
    const user = useSelector((data: RootState) => data.userState.userEmail);

    const [productDetails, setProductDetails] = useState<Product | null>(null);
    const [prevReview, setPrevReview] = useState('');
    const [prevRating, setPrevRating] = useState(0);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatRoomId, setChatRoomId] = useState<string | null>(null);

    const fetchReview = async () => {
        try {
            const response = await apiClient.get(`/review/getUserReview/${orderId}/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                console.log('rating', response.data.data);
                setPrevRating(response.data.data.rating);
                setPrevReview(response.data.data.reviewText);
            } else {
                console.error('Failed to fetch product review:', response.data.error);
            }
        } catch (err: any) {
            console.error('Error fetching product review:', err);
        }
    }

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await apiClient.get(`/products/getProductById/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    console.log(response.data);
                    setProductDetails(response.data.data);
                } else {
                    console.error('Failed to fetch product details:', response.data.error);
                }
            } catch (err: any) {
                console.error('Error fetching product details:', err);
            }
        };

        if (productId) {
            fetchProductDetails();
            fetchReview();
        }
    }, []);

    const handleSubmitReview = async () => {
        console.log(user, orderId, productId, quantity, rating, review);
        try {
            const response = await apiClient.post(
                `/review/addReview`,
                {
                    user,
                    orderId,
                    productId,
                    quantity,
                    rating,
                    reviewText: review,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                alert('Review submitted successfully!');
                setReview('');
                setRating(0);
                fetchReview();
            } else {
                console.error('Failed to submit review:', response.data.error);
            }
        } catch (err: any) {
            console.error('Error submitting review:', err);
        }
    };

    const handleOpenChat = async () => {
        try {
            // Fetch or create chat room ID
            const response = await apiClient.post('/chat/getOrCreateChatRoom', { buyerId: user, sellerId: productDetails!.sellerName });
            if (response.data.success) {
                setChatRoomId(response.data.chatRoomId);
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

    if(!user){
        return <>User authentical failed!</>
    }


    return (
        <div>
            <h1>Product Details</h1>
            {productDetails ? (
                <div>
                    <h2>{productDetails.name}</h2>
                    <p>{productDetails.description}</p>
                    <p>Price: ${productDetails.price}</p>
                    <p>Quantity: {quantity}</p>
                    {productDetails.images.length !== 0 && (
                        <div className="flex flex-wrap gap-4">
                            {productDetails.images.map((imgUrl, index) => (
                                <img
                                    key={index}
                                    src={imgUrl}
                                    alt={productDetails.name}
                                    className="w-48 h-auto object-cover"
                                />
                            ))}
                        </div>
                    )}
                    <div>
                        {(prevRating !== 0) ? (
                            <div>
                                <h4>Rating: {prevRating} Stars</h4>
                                <p>Review: {prevReview}</p>
                            </div>
                        ) : (
                            <div>
                                <h3>Submit Your Review</h3>
                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder="Write your review here..."
                                    rows={4}
                                    cols={50}
                                />
                                <br />
                                <label>
                                    Rating:
                                    <input
                                        type="number"
                                        value={rating}
                                        onChange={(e) => setRating(Number(e.target.value))}
                                        min={1}
                                        max={5}
                                        style={{ color: 'black' }}
                                    />
                                </label>
                                <br />
                                <button onClick={handleSubmitReview}>Submit Review</button>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleOpenChat}
                        className="mt-6 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                        Contact Seller
                    </button>
                    {isChatOpen && chatRoomId && <ChatBox chatRoomId={chatRoomId}
                    userId={user}
                    receiverId={productDetails.sellerName} onClose={handleCloseChat} />}
                </div>
            ) : (
                <p>Loading product details...</p>
            )}
        </div>
    );
}
