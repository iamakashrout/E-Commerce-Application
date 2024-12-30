import express from "express";
import { verifyToken } from "../middleware/auth";
import { cancelOrder, getAllOrders, getOrderDetails, paymentGateway, placeOrder } from "../controllers/orderControllers";

const router = express.Router();

router.post("/placeOrder", verifyToken, placeOrder);
router.get("/getAllOrders/:user", verifyToken, getAllOrders);
router.get("/getOrderDetails/:orderId", verifyToken, getOrderDetails);
router.post("/cancelOrder/:orderId", verifyToken, cancelOrder);
router.post("/paymentGateway", paymentGateway);

export default router;