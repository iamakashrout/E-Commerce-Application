import express from "express";

import { addSeller, getSellersProducts, updateProduct, removeProduct } from "../controllers/sellerControllers";
const router = express.Router();

router.post("/addSeller", addSeller);
router.get("/getSellerProducts/:sellerName", getSellersProducts);
router.put("/updateProduct/:productId", updateProduct);
router.delete("/removeProduct/:productId", removeProduct);

export default router;
