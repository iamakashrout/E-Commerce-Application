import { Request, Response } from 'express';
import Message from '../models/messageSchema';

export const getMessageHistory = async (req: Request, res: Response) => {
    const { chatRoomId } = req.params;

    try {
        const messages = await Message.find({ chatRoomId }).sort({ createdAt: 1 });
        res.status(200).json({ success: true, data: messages });
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ success: false, error: 'Server error fetching messages' });
    }
};