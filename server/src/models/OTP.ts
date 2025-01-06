import mongoose, { Schema, Document } from 'mongoose';

export interface OTPDocument extends Document {
    email: string;
    otp: string;
    createdAt: Date;
    expiresAt: Date;
}

const OTPSchema: Schema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
});

export default mongoose.model<OTPDocument>('OTP', OTPSchema);
