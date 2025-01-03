import { Server, Socket } from 'socket.io';
import Message from '../models/messageSchema';
import ChatRoom from '../models/chatroomSchema';

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
                });

                // Emit the message to the room
                io.to(chatRoomId).emit('message', newMessage);
            } catch (err) {
                console.error('Error sending message:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

export default socket;