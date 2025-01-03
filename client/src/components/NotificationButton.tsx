'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import apiClient from '@/utils/axiosInstance';
import socketURL from '@/utils/socketInstance';

const socket = io(socketURL);

interface ChatNotification {
    _id: string;
    count: number;
}

interface NotificationsProps {
    userId: string;
    // onChatOpen: (chatRoomId: string, receiverId: string) => void;
}

export default function NotificationsButton({ userId }: NotificationsProps) {
    const [notifications, setNotifications] = useState<ChatNotification[]>([]);
    const [showList, setShowList] = useState(false);

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
                    return prev.map((n) =>
                        n._id === data.chatRoomId 
                            ? { ...n, count: data.count === 0 ? 0 : n.count + data.count } 
                            : n
                    );
                }
                return [...prev, {_id: data.chatRoomId, count: data.count}];
            });
        });

        return () => {
            socket.off(`notification-${userId}`);
        };
    }, []);

    const handleChatOpen = async (chatRoomId: string, receiverId: string) => {
        try {
            const response = await apiClient.post(`/messages/markRead` ,{chatRoomId, userId: receiverId});
            console.log('read', response.data);
        } catch (err) {
            console.error('Error marking as read:', err);
        }
        // onChatOpen(chatRoomId, receiverId);
        console.log('notifs', notifications);
        socket.emit('markRead', { chatRoomId, userId });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowList(!showList)}
                className="relative p-2 bg-blue-500 text-white rounded-full"
            >
                🔔 {notifications.reduce((sum, n) => sum + n.count, 0)}
            </button>

            {showList && (
                <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded-md z-10">
                    {notifications.length > 0 ? (
                        notifications.map((notif, index) => (
                            <div
                                key={index}
                                className="p-2 border-b flex justify-between cursor-pointer hover:bg-gray-100"
                                onClick={() => handleChatOpen(notif._id, userId)}
                            >
                                <span className="text-black">Chat {notif._id}</span>
                                <span className="text-red-500">{notif.count}</span>
                            </div>
                        ))
                    ) : (
                        <div className="p-2 text-center">No notifications</div>
                    )}
                </div>
            )}
        </div>
    );
}