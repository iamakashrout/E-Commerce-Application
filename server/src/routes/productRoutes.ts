import express from "express";

import { getAllProducts, getProductById, addProduct, searchProduct } from "../controllers/productControllers";
const router = express.Router();

router.get("/getAllProducts", getAllProducts);
router.get("/getProduct/:productId", getProductById);
router.post("/addProduct", addProduct);
router.get("/searchProducts", searchProduct);

export default router;
