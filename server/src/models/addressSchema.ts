import mongoose, { Schema, Document, Model } from 'mongoose';

// Define an interface for the Address document
export interface IAddress extends Document {
  userId: mongoose.Types.ObjectId;
  addressLine: string;
}

// Create the Address schema
const AddressSchema: Schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addressLine: { type: String, required: true },
});

// Export the Address model with the interface
const Address: Model<IAddress> = mongoose.model<IAddress>('Address', AddressSchema);

export default Address;
