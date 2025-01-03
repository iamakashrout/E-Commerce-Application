import express from "express";
import { getOrCreateChatRoom } from '../controllers/chatControllers';

const router = express.Router();

router.post('/getOrCreateChatRoom', getOrCreateChatRoom);

export default router;