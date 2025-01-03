import { Request, Response } from "express";
import Message from "../models/messageSchema";

export const getMessageHistory = async (req: Request, res: Response) => {
  const { chatRoomId } = req.params;

  try {
    const messages = await Message.find({ chatRoomId }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res
      .status(500)
      .json({ success: false, error: "Server error fetching messages" });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const chats = await Message.aggregate([
      { $match: { receiverId: userId, isRead: false } },
      { $group: { _id: "$chatRoomId", senderId: { $first: "$senderId" }, count: { $sum: 1 } } },
    ]);
    res.json({ success: true, data: chats });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching notifications" });
  }
};

export const markRead = async (req: Request, res: Response) => {
  const { chatRoomId, userId } = req.body;
  try {
    await Message.updateMany(
      { chatRoomId, receiverId: userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error marking messages as read" });
  }
};
