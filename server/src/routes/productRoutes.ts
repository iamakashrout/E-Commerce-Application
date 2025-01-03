import express from "express";

import { getAllProducts, getProductById, addProduct, searchProduct } from "../controllers/productControllers";
import { verifyToken } from "../middleware/auth";
const router = express.Router();

// router.get("/getAllProducts", verifyToken, getAllProducts);
router.get("/getAllProducts", getAllProducts);
router.get("/getProductById/:productId", verifyToken, getProductById);
router.post("/addProduct", verifyToken, addProduct);
router.get("/searchProducts", verifyToken, searchProduct);

export default router;