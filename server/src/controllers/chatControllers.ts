import { Request, Response } from 'express';
import ChatRoom from '../models/chatroomSchema';

export const getOrCreateChatRoom = async (req: Request, res: Response) => {
    const { buyerId, sellerId } = req.body;

    try {
        // Check if a chat room already exists
        let chatRoom = await ChatRoom.findOne({ buyerId, sellerId });
        if (!chatRoom) {
            // Create a new chat room
            chatRoom = await ChatRoom.create({ buyerId, sellerId });
        }

        res.status(200).json({ success: true, chatRoomId: chatRoom._id });
    } catch (err) {
        console.error('Error getting/creating chat room:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};