'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import apiClient from '@/utils/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { Product } from '@/types/product';
import ChatBox from '@/components/ChatBox';
import Navbar from '@/components/Navbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import Image from 'next/image';

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

    const fetchReview = useCallback(async () => {
        try {
            const response = await apiClient.get(`/review/getUserReview/${orderId}/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.data.success) {
                setPrevRating(response.data.data.rating);
                setPrevReview(response.data.data.reviewText);
            }
        } catch (err) {
            console.error('Error fetching product review:', err);
        }
    }, [orderId, productId, token, setPrevRating, setPrevReview]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await apiClient.get(`/products/getProductById/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setProductDetails(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching product details:', err);
            }
        };

        if (productId) {
            fetchProductDetails();
            fetchReview();
        }
    }, [fetchReview, productId, token]);

    const handleSubmitReview = async () => {
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
            }
        } catch (err) {
            console.error('Error submitting review:', err);
        }
    };

    const handleOpenChat = async () => {
        try {
            const response = await apiClient.post('/chat/getOrCreateChatRoom', {
                buyerId: user,
                sellerId: productDetails!.sellerName,
            });
            if (response.data.success) {
                setChatRoomId(response.data.chatRoomId);
                setIsChatOpen(true);
            }
        } catch (err) {
            console.error('Error initializing chat room:', err);
        }
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
    };

    if (!user) {
        return <div className="text-center mt-20 text-red-600">User authentication failed!</div>;
    }

    return (
        <div className="dark:bg-black min-h-screen overflow-hidden">
            <Navbar />
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6 text-center dark:text-custom-teal">Product Details</h1>
                {productDetails ? (
                    <div className="bg-custom-light-teal dark:bg-custom-teal shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-bold">{productDetails.name}</h2>
                        <p className="text-gray-700 mt-2">{productDetails.description}</p>
                        <p className="text-lg font-semibold mt-2">Price: ${productDetails.price}</p>
                        <p className="text-lg font-semibold">Quantity: {quantity}</p>
                        {productDetails.images.length > 0 && (
                            <div className="mt-6 flex justify-center items-center">
                                <div className="w-1/2 relative">
                                    <Swiper
                                        navigation={true}
                                        modules={[Navigation]}
                                        className="mySwiper"
                                        spaceBetween={10}
                                        slidesPerView={1}
                                    >
                                        {productDetails.images.map((imgUrl, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="m-auto w-64 h-64">
                                                    <Image
                                                        src={imgUrl}
                                                        alt={productDetails.name}
                                                        className="object-cover rounded-lg"
                                                        width={256} // Match the width (64 * 4)
                                                        height={256} // Match the height (64 * 4)
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        )}
                        <div className="mt-6">
                            {prevRating ? (
                                <div>
                                    <h4 className="font-semibold">Your Previous Rating: {prevRating} Stars</h4>
                                    <p className="text-gray-700">Review: {prevReview}</p>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="font-semibold mb-2">Submit Your Review</h3>
                                    <textarea
                                        className="w-full border rounded-lg p-2"
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        placeholder="Write your review..."
                                    />
                                    <label className="block mt-2">
                                        <span className="text-gray-700 font-semibold">Rating:</span>
                                        <input
                                            type="number"
                                            className="block w-full mt-2 border rounded-lg p-2"
                                            value={rating}
                                            onChange={(e) => setRating(Number(e.target.value))}
                                            min={1}
                                            max={5}
                                        />
                                    </label>
                                    <button
                                        onClick={handleSubmitReview}
                                        className="bg-custom-pink text-white px-4 py-2 rounded-md mt-4 hover:bg-custom-lavender font-bold transition duration-300"
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleOpenChat}
                            className="bg-green-500 text-white font-bold px-4 py-2 rounded-md mt-6 hover:bg-green-600 flex items-center justify-center gap-2 transition duration-300"
                        >
                            Contact Seller
                        </button>
                        {isChatOpen && chatRoomId && (
                            <ChatBox
                                chatRoomId={chatRoomId}
                                userId={user}
                                receiverId={productDetails.sellerName}
                                onClose={handleCloseChat}
                            />
                        )}
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-lg text-gray-600">Loading product details...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
