import express from "express";

import { addSeller, getSellersProducts, updateProduct, removeProduct } from "../controllers/sellerControllers";
import { verifyToken } from "../middleware/auth";
const router = express.Router();

router.post("/addSeller", verifyToken, addSeller);
router.get("/getSellerProducts/:sellerName", verifyToken, getSellersProducts);
router.put("/updateProduct/:productId", verifyToken, updateProduct);
router.delete("/removeProduct/:productId", verifyToken, removeProduct);

export default router;
