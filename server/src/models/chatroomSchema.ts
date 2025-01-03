import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChatRoom extends Document {
    buyerId: string;
    sellerId: string;
}

const ChatRoomSchema: Schema = new Schema({
    buyerId: { type: String, required: true },
    sellerId: { type: String, required: true },
});

const ChatRoom: Model<IChatRoom> = mongoose.model<IChatRoom>('ChatRoom', ChatRoomSchema);

export default ChatRoom;