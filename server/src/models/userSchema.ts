import mongoose, { Document, Schema, Model } from "mongoose";

/* Define the TypeScript interface for a User document */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  loyaltyPoints: number;
  createdAt: Date;
}

/* Create the Mongoose schema for the User */
const UserSchema: Schema<IUser> = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  loyaltyPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

/* Export the User model with the IUser interface */
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
