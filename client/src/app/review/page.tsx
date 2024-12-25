'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import apiClient from '@/utils/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';

interface Product {
    productId: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

export default function AddReviewPage() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');
    const token = useSelector((data: RootState) => data.userState.token);
    const user = useSelector((data: RootState) => data.userState.userEmail);

    const [productDetails, setProductDetails] = useState<Product | null>(null);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);

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
                } else {
                    console.error('Failed to fetch product details:', response.data.error);
                }
            } catch (err: any) {
                console.error('Error fetching product details:', err);
            }
        };

        if (productId) fetchProductDetails();
    }, [productId]);

    const handleSubmitReview = async () => {
        try {
            const response = await apiClient.post(
                `/review/addReview/${productId}`,
                {
                    user,
                    productId,
                    reviewText: review, 
                    rating,
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
            } else {
                console.error('Failed to submit review:', response.data.error);
            }
        } catch (err: any) {
            console.error('Error submitting review:', err);
        }
    };

    return (
        <div>
            <h1>Product Details</h1>
            {productDetails ? (
                <div>
                    <h2>{productDetails.name}</h2>
                    <p>{productDetails.description}</p>
                    <p>Price: ${productDetails.price}</p>
                    <p>Quantity: {productDetails.quantity}</p>
                    {productDetails.imageUrl && (
                        <img src={productDetails.imageUrl} alt={productDetails.name} style={{ width: '200px' }} />
                    )}
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
                        />
                    </label>
                    <br />
                    <button onClick={handleSubmitReview}>Submit Review</button>
                </div>
            ) : (
                <p>Loading product details...</p>
            )}
        </div>
    );
}
