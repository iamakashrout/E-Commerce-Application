import mongoose, { Schema, Document, Model } from 'mongoose';

// Define an interface for the Product document
export interface IProduct extends Document {
  id: string;
  name: string;
  company: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images?: string[];
  sellerName: string;
  createdAt: Date;
}

// Create the Product schema
const ProductSchema: Schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  images: [{ type: String }], // Optional array of image URLs
  // sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true }, // Reference to the Seller model
  sellerName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

// Export the Product model with the interface
const Product: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
