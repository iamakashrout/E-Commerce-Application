import express from "express";
import { addToCart, removeFromCart, getCartDetails} from "../controllers/cartControllers";

const router = express.Router();

router.post("/addToCart", addToCart);
router.delete("/removeFromCart/:id", removeFromCart);
router.get("/getCartDetails", getCartDetails);

export default router;
