"use client";
import { useEffect, useRef, useState } from "react";
import apiClient from "@/utils/axiosInstance";
import { io } from "socket.io-client";
import socketURL from "@/utils/socketInstance";
import { Message } from "@/types/message";

const socket = io(socketURL);

interface ChatBoxProps {
    chatRoomId: string;
    userId: string;
    receiverId: string;
    onClose: () => void;
}

export default function ChatBox({ chatRoomId, userId, receiverId, onClose }: ChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Join the chat room
        socket.emit("joinRoom", { chatRoomId });

        // Fetch chat history
        const fetchMessages = async () => {
            try {
                const response = await apiClient.get(`/messages/getMessageHistory/${chatRoomId}`);
                if (response.data.success) {
                    setMessages(response.data.data);
                }
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };

        fetchMessages();

        // Listen for new messages
        socket.on("message", (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.off("message");
        };
    }, [chatRoomId]);

    useEffect(() => {
        // Scroll to the bottom whenever messages update
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if (currentMessage.trim() === "") return;
        const messageData = {
            chatRoomId,
            senderId: userId,
            receiverId,
            message: currentMessage,
        };
        socket.emit("sendMessage", messageData);
        setCurrentMessage("");
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-custom-light-teal rounded-lg shadow-lg w-[32rem] h-[28rem] p-4 text-black">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">Chat Box</h3>
                    <button
                        onClick={onClose}
                        className="text-red-500 hover:text-red-700 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>
                <div className="mt-4 border border-black rounded-md h-80 overflow-y-auto p-2">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"
                                } mb-2`}
                        >
                            <div
                                className={`rounded-md p-2 max-w-xs ${msg.senderId === userId
                                        ? "bg-custom-yellow text-black"
                                        : "bg-custom-background text-black"
                                    }`}
                            >
                                <strong className="block text-xs">
                                    {msg.senderId === userId ? "You" : receiverId}
                                </strong>
                                <p className="text-base">{msg.message}</p>

                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="mt-4 flex">
                    <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="border p-2 rounded-md flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-custom-pink text-white px-4 py-2 rounded-md ml-2 hover:bg-custom-lavender font-bold"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
