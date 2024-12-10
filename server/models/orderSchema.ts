import mongoose, { Schema, Document, Model } from 'mongoose';

// Define an interface for the Order document
export interface IOrderProduct {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  products: IOrderProduct[];
  totalAmount: number;
  status: 'Ordered' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: mongoose.Types.ObjectId;
  paymentMethod: string; // e.g., 'Credit Card', 'UPI'
  createdAt: Date;
}

// Create the Order schema
const OrderSchema: Schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Ordered', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Ordered',
  },
  shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  paymentMethod: { type: String, required: true }, // e.g., 'Credit Card', 'UPI'
  createdAt: { type: Date, default: Date.now },
});

// Export the Order model with the interface
const Order: Model<IOrder> = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
