'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import apiClient from '@/utils/axiosInstance';
import socketURL from '@/utils/socketInstance';
import ChatBox from './ChatBox';

const socket = io(socketURL);

interface ChatNotification {
    _id: string;
    senderId: string;
    count: number;
}

interface NotificationsProps {
    userId: string;
}

export default function NotificationsButton({ userId }: NotificationsProps) {
    const [notifications, setNotifications] = useState<ChatNotification[]>([]);
    const [showList, setShowList] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatRoom, setChatRoom] = useState<string | null>(null);
    const [receiverId, setReceiverId] = useState<string | null>(null);

    useEffect(() => {
        // Fetch initial unread messages count
        const fetchNotifications = async () => {
            try {
                const response = await apiClient.get(`/messages/getNotifications/${userId}`);
                if (response.data.success) {
                    setNotifications(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching notifications:', err);
            }
        };
        fetchNotifications();

        // Listen for live notifications
        socket.on(`notification-${userId}`, (data) => {
                setNotifications((prev) => {
                    const existing = prev.find((n) => n._id === data.chatRoomId);
                    if (existing) {
                        return data.count === 0
                            ? prev.filter((n) => n._id !== data.chatRoomId) // Remove the item if count is 0
                            : prev.map((n) =>
                                n._id === data.chatRoomId
                                    ? { ...n, count: n.count + data.count } // Increment count if count is non-zero
                                    : n
                            );
                    }
                    return [...prev, { _id: data.chatRoomId, senderId: data.senderId, count: data.count }];
                });
        });

        return () => {
            socket.off(`notification-${userId}`);
        };
    }, []);

    const handleChatOpen = async (chatRoomId: string, receiverId: string, senderId: string) => {
        try {
            const response = await apiClient.post(`/messages/markRead`, { chatRoomId, userId: receiverId });
            console.log('read', response.data);
            setChatRoom(chatRoomId);
            setReceiverId(senderId);
            setIsChatOpen(true);
        } catch (err) {
            console.error('Error marking as read:', err);
        }
        socket.emit('markRead', { chatRoomId, userId, senderId });
        console.log(1, notifications);
    };

    const handleCloseChat = async (chatRoomId: string, receiverId: string, senderId: string) => {
        try {
            const response = await apiClient.post(`/messages/markRead`, { chatRoomId, userId: receiverId });
            console.log('closed', response.data);
            setIsChatOpen(false);
        } catch (err) {
            console.error('Error marking as read:', err);
        }
        socket.emit('markRead', { chatRoomId, userId, senderId });
        console.log(2, notifications);
    };

    return (
        <div className="relative">
            {!showList ? (
                <button
                onClick={() => setShowList(!showList)}
                className="absolute top-0 right-0 p-2 bg-blue-500 text-white rounded-full"
            >
                Notifications {notifications.reduce((sum, n) => sum + n.count, 0)}
            </button>
            ) : (
                <button
                onClick={() => setShowList(!showList)}
                className="absolute top-0 right-0 p-2 bg-blue-500 text-white rounded-full"
            >
                Notifications
            </button>
            )}
            

            {showList && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-white w-80 rounded-md shadow-lg">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold text-black">Notifications</h3>
                            <button
                                onClick={() => setShowList(false)}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                ✖
                            </button>
                        </div>
                        <div className="p-4 max-h-80 overflow-y-auto text-black">
                            {notifications.length > 0 ? (
                                notifications.map((notif, index) => (
                                    <div key={index} className="p-2 border-b cursor-pointer">
                                        <div className="flex justify-between hover:bg-gray-100">
                                            <span className="text-black">{notif.senderId}</span>
                                            <span className="text-red-500">{notif.count}</span>
                                        </div>
                                        <button
                                            onClick={() => handleChatOpen(notif._id, userId, notif.senderId)}
                                            className="block mt-2 text-blue-500"
                                        >
                                            Open
                                        </button>
                                    </div>
                                    
                                ))
                            ) : (
                                <div className="p-2 text-center">No notifications</div>
                            )}
                        </div>
                    </div>
                    {isChatOpen && receiverId && chatRoom && <ChatBox chatRoomId={chatRoom}
                                                            userId={userId}
                                                            receiverId={receiverId} onClose={()=>handleCloseChat(chatRoom, userId, receiverId)} />}
                </div>
            )}
        </div>
    );
}
