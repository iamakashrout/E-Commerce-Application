import { Request, Response } from "express";
import Review from "../models/reviewSchema";
import Product from "../models/productSchema";



// give product review
export const addReview = async (req: Request, res: Response): Promise<void> => {
    try {
        // const { productId } = req.params;
        const { user, orderId, productId, quantity, rating, reviewText } = req.body;

        if (!user || !orderId || !productId || !quantity || !rating) {
            res.status(400).json({ success: false, error: 'Please fill all mandatory fields.' });
            return;
        }

        const currProd = await Product.findOne({ id: productId });
        if (!currProd) {
            res.status(400).json({ success: false, error: 'Product does not exist' });
            return;
        }

        const existingReview = await Review.findOne({ user: user, productId: productId, orderId: orderId });
        if (existingReview) {
            res.status(400).json({ success: false, error: 'User has already reviewed this product order.' });
            return;
        }

        const newReview = new Review({
            user,
            orderId,
            productId,
            quantity,
            rating,
            reviewText,
        });

        const savedReview = await newReview.save();

        res.status(201).json({
            success: true,
            message: 'Review added successfully.',
            data: savedReview,
        });

    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ success: false, error: "Failed to add review" });
    }
}


// get all reviews of a product
export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId } = req.params;

        const currProd = await Product.findOne({ id: productId });
        if (!currProd) {
            res.status(400).json({ success: false, error: 'Product does not exist' });
            return;
        }

        const reviews = await Review.find({ productId });
        res.status(200).json({ success: true, data: reviews });

    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ success: false, error: "Failed to fetch product reviews" });
    }
}


// get review of a product by a user
export const getUserReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId, productId } = req.params;

        const userReview = await Review.findOne({ orderId, productId });
        if (!userReview) {
            res.status(200).json({ success: true, data:{"rating": 0, "reviewText": ""} });
            return;
        }
        res.status(200).json({ success: true, data: userReview });

    } catch (error) {
        console.error("Error fetching user review:", error);
        res.status(500).json({ success: false, error: "Failed to fetch user review" });
    }
}