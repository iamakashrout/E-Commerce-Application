import express from "express";
import { addToCart, removeFromCart, getCartDetails} from "../controllers/cartControllers";

const router = express.Router();

router.post("/addToCart", addToCart);
router.post("/removeFromCart", removeFromCart);
router.get("/getCartDetails/:user", getCartDetails);

export default router;
