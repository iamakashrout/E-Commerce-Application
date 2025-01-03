import express from "express";
import { getMessageHistory } from '../controllers/messageControllers';

const router = express.Router();

router.get('/getMessageHistory/:chatRoomId', getMessageHistory);

export default router;