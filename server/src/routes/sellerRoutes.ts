import express from "express";

import { getSellersProducts, updateProduct, removeProduct, sellerRegister, sellerLogin } from "../controllers/sellerControllers";
import { verifyToken } from "../middleware/auth";
const router = express.Router();

router.post("/sellerRegister", sellerRegister);
router.post("/sellerLogin", sellerLogin);
router.get("/getSellerProducts/:sellerName", verifyToken, getSellersProducts);
router.put("/updateProduct/:productId", verifyToken, updateProduct);
router.delete("/removeProduct/:productId", verifyToken, removeProduct);

export default router;
