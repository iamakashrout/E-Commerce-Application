import mongoose, { Schema, Document, Model } from 'mongoose';

// Define an interface for the Review document
export interface IReview extends Document {
  user: string;
  orderId: string;
  productId: string;
  quantity: number;
  rating: number;
  reviewText?: string;
  createdAt: Date;
}

// Create the Review schema
const ReviewSchema: Schema = new mongoose.Schema({
  user: { type: String, required: true },
  orderId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Export the Review model with the interface
const Review: Model<IReview> = mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
