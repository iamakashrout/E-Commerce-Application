"use client"
import apiClient from '@/utils/axiosInstance';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

interface ChatBoxProps {
    chatRoomId: string;
    userId: string;
    receiverId: string;
    onClose: () => void;
}

export default function ChatBox({  chatRoomId, userId, receiverId, onClose }: ChatBoxProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');

    useEffect(() => {
        // Join the chat room
        socket.emit('joinRoom', { chatRoomId });

        // Fetch chat history
        const fetchMessages = async () => {
            try {
                const response = await apiClient.get(`/messages/getMessageHistory/${chatRoomId}`);
                if (response.data.success) {
                    setMessages(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching messages:', err);
            }
        };

        fetchMessages();

        // Listen for new messages
        socket.on('message', (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.off('message');
        };
    }, [chatRoomId]);

    const handleSendMessage = () => {
        if (currentMessage.trim() === '') return;
        const messageData = {
            chatRoomId,
            senderId: userId,
            receiverId,
            message: currentMessage,
        };
        socket.emit('sendMessage', messageData);
        setCurrentMessage('');
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">Chat Box</h3>
                    <button
                        onClick={onClose}
                        className="text-red-500 hover:text-red-700 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>
                <div className="mt-4 border rounded-md h-48 overflow-y-auto p-2">
                    {messages.map((msg, index) => (
                        <div key={index} className="mb-2">
                            <strong>{msg.senderId === userId ? 'You' : 'Other'}:</strong> {msg.message}
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex">
                    <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="border p-2 rounded-md flex-grow"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
