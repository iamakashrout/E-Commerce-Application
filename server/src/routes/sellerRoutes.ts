import express from "express";

import { getSellersProducts, updateProduct, removeProduct, sellerRegister, sellerLogin } from "../controllers/sellerControllers";
import { verifyToken } from "../middleware/auth";
const router = express.Router();

router.post("/sellerRegister", sellerRegister);
router.post("/sellerLogin", sellerLogin);
router.get("/getSellerProducts/:sellerName", getSellersProducts);
router.put("/updateProduct/:productId", updateProduct);
router.delete("/removeProduct/:productId", removeProduct);

export default router;
