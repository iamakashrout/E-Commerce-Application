import mongoose, { Schema, Document, Model } from 'mongoose';

// Define an interface for the Seller document
export interface ISeller extends Document {
  name: string;
  email: string;
  createdAt: Date;
}

// Create the Seller schema
const SellerSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Export the Seller model with the interface
const Seller: Model<ISeller> = mongoose.model<ISeller>('Seller', SellerSchema);

export default Seller;