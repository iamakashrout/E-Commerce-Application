import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOTP extends Document {
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

const OTP: Model<IOTP> = mongoose.model<IOTP>('OTP', OTPSchema);

export default OTP;
