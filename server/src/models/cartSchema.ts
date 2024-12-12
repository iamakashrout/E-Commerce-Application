import mongoose, { Document, Schema, Model } from "mongoose";

interface ICartItem extends Document {
  product: mongoose.Schema.Types.ObjectId; // References a product
  quantity: number;
  addedAt: Date;
}

const CartSchema: Schema<ICartItem> = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  addedAt: { type: Date, default: Date.now },
});

const Cart: Model<ICartItem> = mongoose.model<ICartItem>("Cart", CartSchema);

export default Cart;
