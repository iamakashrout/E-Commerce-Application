import mongoose, { Schema, Document, Model } from 'mongoose';

// Define an interface for the Review document
export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  rating: number;
  reviewText?: string;
  // sentiment?: 'Positive' | 'Neutral' | 'Negative'; // Uncomment if sentiment is used
  createdAt: Date;
}

// Create the Review schema
const ReviewSchema: Schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String },
  // sentiment: { type: String, enum: ['Positive', 'Neutral', 'Negative'] }, // Uncomment if needed
  createdAt: { type: Date, default: Date.now },
});

// Export the Review model with the interface
const Review: Model<IReview> = mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
