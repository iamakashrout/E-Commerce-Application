import { Server, Socket } from 'socket.io';
import Message from '../models/messageSchema';

const socket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        // Join specific chat room
        socket.on('joinRoom', async ({ chatRoomId }) => {
            socket.join(chatRoomId);
            console.log(`User joined room: ${chatRoomId}`);
        });

        // Handle message event
        socket.on('sendMessage', async ({ chatRoomId, senderId, receiverId, message }) => {
            try {
                // Save message to database
                const newMessage = await Message.create({
                    chatRoomId,
                    senderId,
                    receiverId,
                    message,
                    isRead: false,
                });

                // Emit the message to the room
                io.to(chatRoomId).emit('message', newMessage);

                // Emit notification to the receiver
                io.emit(`notification-${receiverId}`, {
                    chatRoomId,
                    senderId,
                    count: 1, // Increment by 1 for this chat
                });
            } catch (err) {
                console.error('Error sending message:', err);
            }
        });

         // Mark messages as read
         socket.on('markRead', async ({ chatRoomId, userId, senderId }) => {
            try {
                io.emit(`notification-${userId}`, {
                    chatRoomId,
                    senderId,
                    count: 0, // Reset count for this chat
                });
            } catch (err) {
                console.error('Error marking messages as read:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

export default socket;