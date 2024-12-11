import express from "express";
import { addItemToCart, getCartDetails, removeItemFromCart } from "../controllers/cartController";

const router = express.Router();

router.post("/api/cart", addItemToCart);
router.get("/api/cart", getCartDetails);
router.delete("/api/cart/:id", removeItemFromCart);

export default router;
