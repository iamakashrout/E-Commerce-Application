import mongoose, { Schema, Document, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


export interface ISelectedProduct {
  productId: string; // identifier of product to be added
  quantity: number;
}

export interface ITotal {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  grandTotal: number;
}

const SelectedProductSchema: Schema<ISelectedProduct> = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

export interface IOrder extends Document {
    orderId: string;
    user: string;
    products: ISelectedProduct[];
    orderDate: Date;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    paymentMode: string;
    address: string;
    total: ITotal;
}

const OrderSchema: Schema<IOrder> = new mongoose.Schema(
  {
    orderId: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    user: {type: String, required: true},
    products: [ SelectedProductSchema ],
    orderDate: { type: Date, default: Date.now }, // Timestamp
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    paymentMode: {type: String, required: true},
    address: {type: String, required: true},
    total: {
      subtotal: { type: Number, required: true },
      tax: { type: Number, required: true },
      shipping: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      grandTotal: { type: Number, required: true },
    },
  }
);

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;