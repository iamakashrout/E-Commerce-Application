import { Request, Response } from "express";
import Product from "../models/productSchema"; // Assuming the Product model is used to submit reviews
import Review from "../models/reviewSchema"; // Assuming you have a Review model

export const submitReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user?.id; // Assuming you have authentication middleware that adds userId to the request

    if (!userId) {
      res.status(401).json({ success: false, error: "User not authenticated" });
      return;
    }

    if (!productId || !rating || rating < 1 || rating > 5) {
      res.status(400).json({ success: false, error: "Invalid product ID or rating. Rating must be between 1 and 5." });
      return;
    }

    // Create a new review
    const review = new Review({
      productId,
      userId,
      rating,
      comment,
      createdAt: new Date(),
    });

    await review.save();

    // Optionally, update product with new review
    const product = await Product.findById(productId);
    if (product) {
      product.reviews.push(review._id);
      await product.save();
    }

    res.status(201).json({ success: true, message: "Review submitted successfully", data: review });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ success: false, error: "Failed to submit review" });
  }
};
