import express from "express";

import { addSeller, getSellersProducts, updateProduct, removeProduct } from "../controllers/sellerControllers";
const router = express.Router();

router.post("/addSeller", addSeller);
router.get("/getSellersProducts/:sellerId", getSellersProducts);
router.put("/updateProduct/:id", updateProduct);
router.delete("/removeProduct/:id", removeProduct);

export default router;
