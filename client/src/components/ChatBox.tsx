"use client"
import { useState } from 'react';

interface ChatBoxProps {
    onClose: () => void;
}

export default function ChatBox({ onClose }: ChatBoxProps) {
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');

    const handleSendMessage = () => {
        if (currentMessage.trim() === '') return;
        const newMessage = { sender: 'You', text: currentMessage };
        setMessages((prev) => [...prev, newMessage]);
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
                    {messages.map((message, index) => (
                        <div key={index} className="mb-2">
                            <strong>{message.sender}:</strong> {message.text}
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
