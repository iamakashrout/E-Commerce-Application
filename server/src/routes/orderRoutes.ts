import express from "express";
import { verifyToken } from "../middleware/auth";
import { cancelOrder, getAllOrders, getOrderDetails, placeOrder } from "../controllers/orderControllers";

const router = express.Router();

// router.post("/placeOrder", verifyToken, placeOrder);
// router.get("/getAllOrders/:user", verifyToken, getAllOrders);
// router.get("/getOrderDetails/:orderId", verifyToken, getOrderDetails);
// router.post("/cancelOrder/:orderId", verifyToken, cancelOrder);
router.post("/placeOrder", placeOrder);
router.get("/getAllOrders/:user", getAllOrders);
router.get("/getOrderDetails/:orderId", getOrderDetails);
router.post("/cancelOrder/:orderId", cancelOrder);

export default router;