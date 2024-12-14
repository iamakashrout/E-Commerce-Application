import express from "express";
import { verifyToken } from "../middleware/auth";
import { cancelOrder, getAllOrders, getOrderDetails, placeOrder } from "../controllers/orderControllers";

const router = express.Router();

router.post("/placeOrder", placeOrder);
router.get("/getAllOrders/:user", getAllOrders);
router.get("/getOrderDetails/:orderId", getOrderDetails);
router.post("/cancelOrder/:orderId", cancelOrder);

export default router;