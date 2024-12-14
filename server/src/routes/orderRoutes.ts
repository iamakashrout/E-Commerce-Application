import express from "express";
import { verifyToken } from "../middleware/auth";
import { placeOrder } from "../controllers/orderControllers";

const router = express.Router();

router.post("/placeOrder", placeOrder);

export default router;