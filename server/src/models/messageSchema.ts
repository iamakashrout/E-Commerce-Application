import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
    chatRoomId: string;
    senderId: string;
    receiverId: string;
    message: string;
    createdAt: Date;
}

const MessageSchema: Schema = new Schema(
    {
        chatRoomId: { type: String, required: true },
        senderId: { type: String, required: true },
        receiverId: { type: String, required: true },
        message: { type: String, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);


const Message: Model<IMessage> = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;