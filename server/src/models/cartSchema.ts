import mongoose, { Document, Schema, Model } from "mongoose";


// schema of cart item
export interface ICartItem {
  productId: string; 
  quantity: number;
}

// schema of cart
export interface ICart extends Document {
  user: string;
  items: ICartItem[]; 
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema: Schema<ICartItem> = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const CartSchema: Schema<ICart> = new mongoose.Schema(
  {
    user: { type: String, required: true },
    items: [CartItemSchema],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// const CartItem: Model<ICartItem> = mongoose.model<ICartItem>("CartItem", CartItemSchema);

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", CartSchema);

export default Cart;