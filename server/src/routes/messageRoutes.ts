import express from "express";
import { getMessageHistory, getNotifications, markRead } from '../controllers/messageControllers';

const router = express.Router();

router.get('/getMessageHistory/:chatRoomId', getMessageHistory);
router.get('/getNotifications/:userId', getNotifications);
router.post('/markRead', markRead);

export default router;