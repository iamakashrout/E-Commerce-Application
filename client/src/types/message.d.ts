export interface Message {
    chatRoomId: string;
    senderId: string;
    receiverId: string;
    message: string;
    isRead: boolean;
}